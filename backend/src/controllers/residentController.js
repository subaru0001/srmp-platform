const pool = require('../config/database');
const { applyCondominioScope } = require('../middleware/condominioScope');

const residentController = {
  // LISTAR RESIDENTES DE UNA UNIDAD (con filtro por condominio)
  listByUnit: async (req, res) => {
    try {
      const { unitId } = req.params;

      const unitCheck = await pool.query(
        'SELECT condominio_id FROM unidades WHERE id = $1',
        [unitId]
      );

      if (unitCheck.rows.length === 0) {
        return res.status(404).json({
          message: '❌ Unidad no encontrada',
          success: false
        });
      }

      const unitCondoId = unitCheck.rows[0].condominio_id;

      if (!req.isSuperAdmin && req.condominioScope && unitCondoId !== req.condominioScope) {
        return res.status(403).json({
          message: '❌ Acceso denegado: No tienes acceso a esta unidad',
          success: false
        });
      }

      let baseQuery = `
        SELECT r.*, u.numero_unidad, u.torre, 
               us.nombres, us.apellidos, us.email, us.rol, us.telefono
        FROM residentes r
        JOIN unidades u ON r.unidad_id = u.id
        JOIN usuarios us ON r.usuario_id = us.id
        WHERE r.unidad_id = $1 AND r.estado = 'activo'
      `;
      let params = [unitId];

      const { query, params: finalParams } = applyCondominioScope(
        baseQuery,
        params,
        req.condominioScope
      );

      const result = await pool.query(query, finalParams);

      res.json({
        message: '✅ Residentes obtenidos',
        success: true,
        data: {
          count: result.rows.length,
          residents: result.rows
        }
      });
    } catch (error) {
      console.error('Error al listar residentes:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // OBTENER RESIDENTE POR ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      let baseQuery = `
        SELECT r.*, u.numero_unidad, u.torre, u.condominio_id,
               us.nombres, us.apellidos, us.email, us.rol, us.telefono
        FROM residentes r
        JOIN unidades u ON r.unidad_id = u.id
        JOIN usuarios us ON r.usuario_id = us.id
        WHERE r.id = $1
      `;
      let params = [id];

      const { query, params: finalParams } = applyCondominioScope(
        baseQuery,
        params,
        req.condominioScope
      );

      const result = await pool.query(query, finalParams);
      const resident = result.rows[0];

      if (!resident) {
        return res.status(404).json({
          message: '❌ Residente no encontrado',
          success: false
        });
      }

      res.json({
        message: '✅ Residente obtenido',
        success: true,
        data: { resident }
      });
    } catch (error) {
      console.error('Error al obtener residente:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // CREAR RESIDENTE
  create: async (req, res) => {
    try {
      const { usuario_id, unidad_id, tipo_vinculo, fecha_ingreso } = req.body;

      if (!usuario_id || !unidad_id) {
        return res.status(400).json({
          message: '❌ Usuario y unidad son requeridos',
          success: false
        });
      }

      const unitCheck = await pool.query(
        'SELECT condominio_id FROM unidades WHERE id = $1',
        [unidad_id]
      );

      if (unitCheck.rows.length === 0) {
        return res.status(404).json({
          message: '❌ Unidad no encontrada',
          success: false
        });
      }

      const unitCondoId = unitCheck.rows[0].condominio_id;

      if (!req.isSuperAdmin && req.condominioScope && unitCondoId !== req.condominioScope) {
        return res.status(403).json({
          message: '❌ Acceso denegado: No puedes agregar residentes a esta unidad',
          success: false
        });
      }

      const userCheck = await pool.query(
        'SELECT id, condominio_id FROM usuarios WHERE id = $1',
        [usuario_id]
      );

      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          message: '❌ Usuario no encontrado',
          success: false
        });
      }

      const userCondoId = userCheck.rows[0].condominio_id;
      if (userCondoId && unitCondoId && userCondoId !== unitCondoId) {
        return res.status(400).json({
          message: '❌ El usuario no pertenece a este condominio',
          success: false
        });
      }

      const result = await pool.query(
        `INSERT INTO residentes (usuario_id, unidad_id, tipo_vinculo, fecha_ingreso)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [usuario_id, unidad_id, tipo_vinculo || 'propietario', fecha_ingreso || new Date()]
      );

      const newResident = result.rows[0];

      res.status(201).json({
        message: '✅ Residente registrado exitosamente',
        success: true,
        data: { resident: newResident }
      });
    } catch (error) {
      console.error('Error al crear residente:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ACTUALIZAR RESIDENTE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo_vinculo, fecha_ingreso, fecha_salida, estado } = req.body;

      const residentCheck = await pool.query(
        `SELECT r.*, u.condominio_id 
         FROM residentes r 
         JOIN unidades u ON r.unidad_id = u.id 
         WHERE r.id = $1`,
        [id]
      );

      if (residentCheck.rows.length === 0) {
        return res.status(404).json({
          message: '❌ Residente no encontrado',
          success: false
        });
      }

      const residentCondoId = residentCheck.rows[0].condominio_id;

      if (!req.isSuperAdmin && req.condominioScope && residentCondoId !== req.condominioScope) {
        return res.status(403).json({
          message: '❌ Acceso denegado: No puedes modificar este residente',
          success: false
        });
      }

      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (tipo_vinculo !== undefined) {
        fields.push(`tipo_vinculo = $${paramIndex++}`);
        values.push(tipo_vinculo);
      }
      if (fecha_ingreso !== undefined) {
        fields.push(`fecha_ingreso = $${paramIndex++}`);
        values.push(fecha_ingreso);
      }
      if (fecha_salida !== undefined) {
        fields.push(`fecha_salida = $${paramIndex++}`);
        values.push(fecha_salida);
      }
      if (estado !== undefined) {
        fields.push(`estado = $${paramIndex++}`);
        values.push(estado);
      }

      if (fields.length === 0) {
        return res.status(400).json({
          message: '❌ No se proporcionaron campos para actualizar',
          success: false
        });
      }

      values.push(id);

      const query = `
        UPDATE residentes 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      const updatedResident = result.rows[0];

      res.json({
        message: '✅ Residente actualizado',
        success: true,
        data: { resident: updatedResident }
      });
    } catch (error) {
      console.error('Error al actualizar residente:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = residentController;