const pool = require('../config/database');
const { applyCondominioScope } = require('../middleware/condominioScope');

const condoController = {
  // LISTAR CONDOMINIOS (con filtro por condominio)
  list: async (req, res) => {
    try {
      // Query base: solo condominios activos
      let baseQuery = 'SELECT * FROM condominios WHERE estado = $1';
      let params = ['activo'];

      // Aplicar filtro por condominio según el usuario
      const { query, params: finalParams } = applyCondominioScope(
        baseQuery,
        params,
        req.condominioScope
      );

      // Agregar ordenamiento
      const finalQuery = `${query} ORDER BY nombre`;

      // Ejecutar consulta
      const result = await pool.query(finalQuery, finalParams);

      res.json({
        message: '✅ Condominios obtenidos',
        success: true,
        data: {                    // ← ✅ CORREGIDO: "data:" como clave
          count: result.rows.length,
          condos: result.rows
        }
      });
    } catch (error) {
      console.error('Error al listar condominios:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // OBTENER CONDOMINIO POR ID (con verificación de acceso)
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      // Query base
      let baseQuery = 'SELECT * FROM condominios WHERE id = $1';
      let params = [id];

      // Aplicar filtro por condominio (para no-admins)
      const { query, params: finalParams } = applyCondominioScope(
        baseQuery,
        params,
        req.condominioScope
      );

      const result = await pool.query(query, finalParams);
      const condo = result.rows[0];

      if (!condo) {
        return res.status(404).json({
          message: '❌ Condominio no encontrado',
          success: false
        });
      }

      res.json({
        message: '✅ Condominio obtenido',
        success: true,
        data: { condo }            // ← ✅ CORREGIDO
      });
    } catch (error) {
      console.error('Error al obtener condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // CREAR CONDOMINIO (Solo Super Admin)
  create: async (req, res) => {
    try {
      // Solo Super Admin puede crear condominios
      if (!req.isSuperAdmin) {
        return res.status(403).json({
          message: '❌ Acceso denegado: Solo Super Admin puede crear condominios',
          success: false
        });
      }

      const { nombre, direccion, ciudad, pais, telefono, email } = req.body;

      if (!nombre || !direccion) {
        return res.status(400).json({
          message: '❌ Nombre y dirección son requeridos',
          success: false
        });
      }

      const result = await pool.query(
        `INSERT INTO condominios (nombre, direccion, ciudad, pais, telefono, email)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [nombre, direccion, ciudad, pais || 'Perú', telefono, email]
      );

      const newCondo = result.rows[0];

      res.status(201).json({
        message: '✅ Condominio creado exitosamente',
        success: true,
        data: { condo: newCondo }  // ← ✅ CORREGIDO
      });
    } catch (error) {
      console.error('Error al crear condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ACTUALIZAR CONDOMINIO (Solo Super Admin o Admin del mismo condominio)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, direccion, ciudad, pais, telefono, email, estado } = req.body;

      // Verificar que el usuario tenga acceso a este condominio
      if (!req.isSuperAdmin && req.condominioScope && parseInt(id) !== req.condominioScope) {
        return res.status(403).json({
          message: '❌ Acceso denegado: No puedes modificar este condominio',
          success: false
        });
      }

      // Construir query dinámica solo con campos enviados
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (nombre !== undefined) {
        fields.push(`nombre = $${paramIndex++}`);
        values.push(nombre);
      }
      if (direccion !== undefined) {
        fields.push(`direccion = $${paramIndex++}`);
        values.push(direccion);
      }
      if (ciudad !== undefined) {
        fields.push(`ciudad = $${paramIndex++}`);
        values.push(ciudad);
      }
      if (pais !== undefined) {
        fields.push(`pais = $${paramIndex++}`);
        values.push(pais);
      }
      if (telefono !== undefined) {
        fields.push(`telefono = $${paramIndex++}`);
        values.push(telefono);
      }
      if (email !== undefined) {
        fields.push(`email = $${paramIndex++}`);
        values.push(email);
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

      // Agregar fecha_actualizacion
      fields.push(`fecha_actualizacion = CURRENT_TIMESTAMP`);

      values.push(id);

      const query = `
        UPDATE condominios 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      const updatedCondo = result.rows[0];

      if (!updatedCondo) {
        return res.status(404).json({
          message: '❌ Condominio no encontrado',
          success: false
        });
      }

      res.json({
        message: '✅ Condominio actualizado',
        success: true,
        data: { condo: updatedCondo }  // ← ✅ CORREGIDO
      });
    } catch (error) {
      console.error('Error al actualizar condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ELIMINAR CONDOMINIO (Solo Super Admin - soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Solo Super Admin puede eliminar condominios
      if (!req.isSuperAdmin) {
        return res.status(403).json({
          message: '❌ Acceso denegado: Solo Super Admin puede eliminar condominios',
          success: false
        });
      }

      const result = await pool.query(
        `UPDATE condominios 
         SET estado = 'inactivo', fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      const deletedCondo = result.rows[0];

      if (!deletedCondo) {
        return res.status(404).json({
          message: '❌ Condominio no encontrado',
          success: false
        });
      }

      res.json({
        message: '✅ Condominio eliminado (inactivado)',
        success: true,
        data: { condo: deletedCondo }  // ← ✅ CORREGIDO
      });
    } catch (error) {
      console.error('Error al eliminar condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = condoController;