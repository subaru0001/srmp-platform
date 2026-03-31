const pool = require('../config/database');

const Ticket = {
  // Obtener todos los tickets (con filtro opcional por condominio)
  async findAll(condominioId = null) {
    let query = `
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
    
    const params = [];
    
    if (condominioId) {
      query += ' AND t.condominio_id = $1';
      params.push(condominioId);
    }
    
    query += ' ORDER BY t.fecha_creacion DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // Buscar ticket por ID
  async findById(id) {
    const result = await pool.query(
      `SELECT t.*, 
              u.nombres as residente_nombres, 
              u.apellidos as residente_apellidos,
              us.nombres as asignado_nombres,
              us.apellidos as asignado_apellidos
       FROM tickets t
       JOIN residentes r ON t.residente_id = r.id
       JOIN usuarios u ON r.usuario_id = u.id
       LEFT JOIN usuarios us ON t.asignado_a = us.id
       WHERE t.id = $1`,
      [id]
    );
    
    return result.rows[0];
  },

  // Crear nuevo ticket
  async create(ticketData) {
    const { 
      condominio_id, 
      residente_id, 
      titulo, 
      descripcion, 
      categoria, 
      subcategoria, 
      prioridad 
    } = ticketData;
    
    const result = await pool.query(
      `INSERT INTO tickets (
         condominio_id, residente_id, titulo, descripcion, 
         categoria, subcategoria, prioridad, estado
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        condominio_id, 
        residente_id, 
        titulo, 
        descripcion, 
        categoria || 'general', 
        subcategoria || null, 
        prioridad || 'media', 
        'abierto'
      ]
    );
    
    return result.rows[0];
  },

  // Actualizar ticket
  async update(id, ticketData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (ticketData.titulo !== undefined) {
      fields.push(`titulo = $${paramIndex++}`);
      values.push(ticketData.titulo);
    }
    if (ticketData.descripcion !== undefined) {
      fields.push(`descripcion = $${paramIndex++}`);
      values.push(ticketData.descripcion);
    }
    if (ticketData.categoria !== undefined) {
      fields.push(`categoria = $${paramIndex++}`);
      values.push(ticketData.categoria);
    }
    if (ticketData.subcategoria !== undefined) {
      fields.push(`subcategoria = $${paramIndex++}`);
      values.push(ticketData.subcategoria);
    }
    if (ticketData.prioridad !== undefined) {
      fields.push(`prioridad = $${paramIndex++}`);
      values.push(ticketData.prioridad);
    }
    if (ticketData.estado !== undefined) {
      fields.push(`estado = $${paramIndex++}`);
      values.push(ticketData.estado);
    }
    if (ticketData.asignado_a !== undefined) {
      fields.push(`asignado_a = $${paramIndex++}`);
      values.push(ticketData.asignado_a);
    }
    if (ticketData.calificacion !== undefined) {
      fields.push(`calificacion = $${paramIndex++}`);
      values.push(ticketData.calificacion);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push(`fecha_actualizacion = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE tickets 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar ticket (soft delete)
  async delete(id) {
    const result = await pool.query(
      `UPDATE tickets 
       SET estado = 'eliminado', fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    return result.rows[0];
  },

  // Obtener estadísticas de tickets por condominio
  async getStats(condominioId) {
    const result = await pool.query(
      `SELECT 
         estado, 
         COUNT(*) as cantidad,
         prioridad,
         categoria
       FROM tickets 
       WHERE condominio_id = $1 AND estado != 'eliminado'
       GROUP BY estado, prioridad, categoria`,
      [condominioId]
    );
    
    return result.rows;
  }
};

module.exports = Ticket;