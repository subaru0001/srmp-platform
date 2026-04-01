const pool = require('../config/database');
const Ticket = require('../models/Ticket');
const { applyCondominioScope } = require('../middleware/condominioScope');
const notificationService = require('../services/notificationService');

const ticketController = {
  list: async (req, res) => {
    try {
      const { estado, categoria, prioridad, page = 1, limit = 10 } = req.query;
      const userRole = req.user.role;
      const userId = req.user.userId;

      // Query base con JOINs
      let baseQuery = `
        SELECT t.*, 
               u.nombres as residente_nombres, 
               u.apellidos as residente_apellidos,
               us.nombres as asignado_nombres,
               us.apellidos as asignado_apellidos
        FROM tickets t
        JOIN residentes r ON t.residente_id = r.id
        JOIN usuarios u ON r.usuario_id = u.id
        LEFT JOIN usuarios us ON t.asignado_a = us.id
        WHERE t.estado != 'eliminado'
      `;
      
      let params = [];
      let paramIndex = 1;

      // 🔹 FILTRADO POR ROL
      if (userRole === 'personal') {
        // Personal solo ve tickets asignados a él
        baseQuery += ` AND t.asignado_a = $${paramIndex++}`;
        params.push(userId);
      } else if (userRole === 'residente') {
        // Residente solo ve sus propios tickets
        baseQuery += ` AND r.usuario_id = $${paramIndex++}`;
        params.push(userId);
      }
      // Admin ve todos los tickets de su condominio (se aplica en applyCondominioScope)

      // Filtros adicionales
      if (estado) {
        baseQuery += ` AND t.estado = $${paramIndex++}`;
        params.push(estado);
      }
      if (categoria) {
        baseQuery += ` AND t.categoria = $${paramIndex++}`;
        params.push(categoria);
      }
      if (prioridad) {
        baseQuery += ` AND t.prioridad = $${paramIndex++}`;
        params.push(prioridad);
      }

      // Aplicar scope de condominio
      const { query: filteredQuery, params: finalParams } = applyCondominioScope(
        baseQuery,
        params,
        req.condominioScope,
        'condominio_id',
        't.'
      );

      // Paginación
      const offset = (page - 1) * limit;
      const limitIndex = finalParams.length + 1;
      const offsetIndex = finalParams.length + 2;
      
      const finalQuery = `${filteredQuery} ORDER BY t.fecha_creacion DESC LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
      finalParams.push(parseInt(limit), offset);

      const result = await pool.query(finalQuery, finalParams);

      // Count total (respetando filtros de rol)
      let countQuery = `SELECT COUNT(*) as total FROM tickets t WHERE t.estado != 'eliminado'`;
      let countParams = [];
      let countParamIndex = 1;

      // Aplicar mismo filtro de rol en el count
      if (userRole === 'personal') {
        countQuery += ` AND t.asignado_a = $${countParamIndex++}`;
        countParams.push(userId);
      } else if (userRole === 'residente') {
        countQuery += ` AND t.residente_id IN (SELECT id FROM residentes WHERE usuario_id = $${countParamIndex++})`;
        countParams.push(userId);
      }

      const countResult = await pool.query(countQuery, countParams);

      res.json({
        message: '✅ Tickets obtenidos',
        success: true,
        data: {
          count: result.rows.length,
          total: parseInt(countResult.rows[0].total),
          page: parseInt(page),
          limit: parseInt(limit),
          tickets: result.rows
        }
      });
    } catch (error) {
      console.error('Error al listar tickets:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          message: '❌ Ticket no encontrado',
          success: false
        });
      }

      // Verificar permisos por rol
      if (req.user.role === 'personal') {
        // Personal solo puede ver tickets asignados a él
        if (ticket.asignado_a !== req.user.userId) {
          return res.status(403).json({
            message: '❌ Acceso denegado: No tienes acceso a este ticket',
            success: false
          });
        }
      } else if (req.user.role === 'residente') {
        // Residente solo puede ver sus propios tickets
        const residentCheck = await pool.query(
          `SELECT id FROM residentes WHERE usuario_id = $1 AND id = $2`,
          [req.user.userId, ticket.residente_id]
        );
        
        if (residentCheck.rows.length === 0) {
          return res.status(403).json({
            message: '❌ Acceso denegado: No tienes acceso a este ticket',
            success: false
          });
        }
      } else if (!req.isSuperAdmin && req.condominioScope && ticket.condominio_id !== req.condominioScope) {
        // Admin solo ve tickets de su condominio
        return res.status(403).json({
          message: '❌ Acceso denegado: No tienes acceso a este ticket',
          success: false
        });
      }

      res.json({
        message: '✅ Ticket obtenido',
        success: true,
        data: { ticket }
      });
    } catch (error) {
      console.error('Error al obtener ticket:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  create: async (req, res) => {
    try {
      const { titulo, descripcion, categoria, subcategoria, prioridad } = req.body;

      if (!titulo || !descripcion) {
        return res.status(400).json({
          message: '❌ Título y descripción son requeridos',
          success: false
        });
      }

      let residenteId = req.body.residente_id;
      let condominioId;

      // ✅ CASO 1: Residente creando su propio ticket
      if (req.user.role === 'residente') {
        const residentCheck = await pool.query(
          `SELECT id, unidad_id FROM residentes WHERE usuario_id = $1 AND estado = 'activo'`,
          [req.user.userId]
        );

        if (residentCheck.rows.length === 0) {
          return res.status(400).json({
            message: '❌ No tienes una unidad asociada. Contacta al administrador.',
            success: false
          });
        }

        residenteId = residentCheck.rows[0].id;
        
        const unitCheck = await pool.query(
          'SELECT condominio_id FROM unidades WHERE id = $1',
          [residentCheck.rows[0].unidad_id]
        );
        
        condominioId = unitCheck.rows[0].condominio_id;

        if (!req.isSuperAdmin && req.condominioScope && condominioId !== req.condominioScope) {
          return res.status(403).json({
            message: '❌ Acceso denegado: No puedes crear tickets en este condominio',
            success: false
          });
        }

        const newTicket = await Ticket.create({
          condominio_id: condominioId,
          residente_id: residenteId,
          titulo,
          descripcion,
          categoria: categoria || 'mantenimiento',
          subcategoria: subcategoria || null,
          prioridad: prioridad || 'media'
        });

        const residenteData = await pool.query(
          `SELECT u.* FROM usuarios u
           JOIN residentes r ON r.usuario_id = u.id
           WHERE r.id = $1`,
          [newTicket.residente_id]
        );

        if (residenteData.rows.length > 0) {
          await notificationService.notifyTicketCreated(newTicket, residenteData.rows[0]);
        }

        res.status(201).json({
          message: '✅ Ticket creado exitosamente',
          success: true,
          data: { ticket: newTicket }
        });
      }
      // ✅ CASO 2: Admin creando ticket para un residente
      else if (req.user.role === 'admin') {
        if (!residenteId) {
          return res.status(400).json({
            message: '❌ Admin debe especificar residente_id',
            success: false
          });
        }

        const residentData = await pool.query(
          `SELECT r.id, r.unidad_id, u.condominio_id 
           FROM residentes r
           JOIN unidades u ON r.unidad_id = u.id
           WHERE r.id = $1`,
          [residenteId]
        );

        if (residentData.rows.length === 0) {
          return res.status(404).json({
            message: '❌ Residente no encontrado',
            success: false
          });
        }

        condominioId = residentData.rows[0].condominio_id;

        if (!req.isSuperAdmin && req.condominioScope && condominioId !== req.condominioScope) {
          return res.status(403).json({
            message: '❌ Acceso denegado: No puedes crear tickets en este condominio',
            success: false
          });
        }

        const newTicket = await Ticket.create({
          condominio_id: condominioId,
          residente_id: residentData.rows[0].id,
          titulo,
          descripcion,
          categoria: categoria || 'mantenimiento',
          subcategoria: subcategoria || null,
          prioridad: prioridad || 'media'
        });

        const residenteUserData = await pool.query(
          `SELECT u.* FROM usuarios u WHERE u.id = (SELECT usuario_id FROM residentes WHERE id = $1)`,
          [residentData.rows[0].id]
        );

        if (residenteUserData.rows.length > 0) {
          await notificationService.notifyTicketCreated(newTicket, residenteUserData.rows[0]);
        }

        res.status(201).json({
          message: '✅ Ticket creado exitosamente',
          success: true,
          data: { ticket: newTicket }
        });
      }
      // ✅ CASO 3: Super Admin
      else {
        if (!residenteId) {
          return res.status(400).json({
            message: '❌ Super Admin debe especificar residente_id',
            success: false
          });
        }

        const residentData = await pool.query(
          `SELECT r.id, r.unidad_id, u.condominio_id 
           FROM residentes r
           JOIN unidades u ON r.unidad_id = u.id
           WHERE r.id = $1`,
          [residenteId]
        );

        if (residentData.rows.length === 0) {
          return res.status(404).json({
            message: '❌ Residente no encontrado',
            success: false
          });
        }

        const newTicket = await Ticket.create({
          condominio_id: residentData.rows[0].condominio_id,
          residente_id: residentData.rows[0].id,
          titulo,
          descripcion,
          categoria: categoria || 'mantenimiento',
          subcategoria: subcategoria || null,
          prioridad: prioridad || 'media'
        });

        const residenteUserData = await pool.query(
          `SELECT u.* FROM usuarios u WHERE u.id = (SELECT usuario_id FROM residentes WHERE id = $1)`,
          [residentData.rows[0].id]
        );

        if (residenteUserData.rows.length > 0) {
          await notificationService.notifyTicketCreated(newTicket, residenteUserData.rows[0]);
        }

        res.status(201).json({
          message: '✅ Ticket creado exitosamente',
          success: true,
          data: { ticket: newTicket }
        });
      }
    } catch (error) {
      console.error('Error al crear ticket:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const ticket = await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          message: '❌ Ticket no encontrado',
          success: false
        });
      }

      // Verificar permisos por rol
      if (req.user.role === 'personal') {
        // Personal solo puede actualizar tickets asignados a él
        if (ticket.asignado_a !== req.user.userId) {
          return res.status(403).json({
            message: '❌ Solo puedes actualizar tickets asignados a ti',
            success: false
          });
        }
      } else if (req.user.role === 'residente') {
        const residentCheck = await pool.query(
          `SELECT r.id FROM residentes r WHERE r.usuario_id = $1 AND r.id = $2`,
          [req.user.userId, ticket.residente_id]
        );

        if (residentCheck.rows.length === 0 && !updateData.calificacion) {
          return res.status(403).json({
            message: '❌ Solo puedes calificar tu propio ticket',
            success: false
          });
        }

        if (Object.keys(updateData).some(key => key !== 'calificacion')) {
          return res.status(403).json({
            message: '❌ Residente solo puede actualizar la calificación',
            success: false
          });
        }
      } else if (!req.isSuperAdmin && req.condominioScope && ticket.condominio_id !== req.condominioScope) {
        return res.status(403).json({
          message: '❌ Acceso denegado: No tienes acceso a este ticket',
          success: false
        });
      }

      const updatedTicket = await Ticket.update(id, updateData);

      if (updateData.estado) {
        const residenteData = await pool.query(
          `SELECT u.* FROM usuarios u
           JOIN residentes r ON r.usuario_id = u.id
           WHERE r.id = $1`,
          [updatedTicket.residente_id]
        );
        if (residenteData.rows.length > 0) {
          await notificationService.notifyTicketStatusChanged(
            updatedTicket, 
            'abierto',
            updateData.estado, 
            residenteData.rows[0]
          );
        }
      }

      res.json({
        message: '✅ Ticket actualizado',
        success: true,
        data: { ticket: updatedTicket }
      });
    } catch (error) {
      console.error('Error al actualizar ticket:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          message: '❌ Acceso denegado: Solo admin puede eliminar tickets',
          success: false
        });
      }

      const ticket = await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          message: '❌ Ticket no encontrado',
          success: false
        });
      }

      if (!req.isSuperAdmin && req.condominioScope && ticket.condominio_id !== req.condominioScope) {
        return res.status(403).json({
          message: '❌ Acceso denegado: No puedes eliminar este ticket',
          success: false
        });
      }

      const deletedTicket = await Ticket.delete(id);

      res.json({
        message: '✅ Ticket eliminado (soft delete)',
        success: true,
        data: { ticket: deletedTicket }
      });
    } catch (error) {
      console.error('Error al eliminar ticket:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  getStats: async (req, res) => {
    try {
      const stats = await Ticket.getStats(req.condominioScope);

      res.json({
        message: '✅ Estadísticas obtenidas',
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = ticketController;