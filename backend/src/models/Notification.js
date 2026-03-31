const pool = require('../config/database');

const Notification = {
  // Obtener notificaciones de un usuario
  async findByUserId(usuarioId, { leido = null, page = 1, limit = 20 } = {}) {
    let query = `
      SELECT n.*, 
             t.titulo as ticket_titulo,
             t.estado as ticket_estado
      FROM notificaciones n
      LEFT JOIN tickets t ON n.ticket_id = t.id
      WHERE n.usuario_id = $1
    `;
    
    const params = [usuarioId];
    let paramIndex = 2;

    if (leido !== null) {
      query += ` AND n.leido = $${paramIndex++}`;
      params.push(leido);
    }

    const offset = (page - 1) * limit;
    query += ` ORDER BY n.fecha_creacion DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Obtener notificación por ID
  async findById(id, usuarioId) {
    const result = await pool.query(
      `SELECT n.*, t.titulo as ticket_titulo
       FROM notificaciones n
       LEFT JOIN tickets t ON n.ticket_id = t.id
       WHERE n.id = $1 AND n.usuario_id = $2`,
      [id, usuarioId]
    );

    return result.rows[0];
  },

  // Obtener conteo de no leídas
  async getUnreadCount(usuarioId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM notificaciones 
       WHERE usuario_id = $1 AND leido = FALSE`,
      [usuarioId]
    );

    return parseInt(result.rows[0].count);
  },

  // Marcar como leída
  async markAsRead(id, usuarioId) {
    const result = await pool.query(
      `UPDATE notificaciones 
       SET leido = TRUE, fecha_leido = CURRENT_TIMESTAMP
       WHERE id = $1 AND usuario_id = $2
       RETURNING *`,
      [id, usuarioId]
    );

    return result.rows[0];
  },

  // Marcar todas como leídas
  async markAllAsRead(usuarioId) {
    const result = await pool.query(
      `UPDATE notificaciones 
       SET leido = TRUE, fecha_leido = CURRENT_TIMESTAMP
       WHERE usuario_id = $1 AND leido = FALSE
       RETURNING *`,
      [usuarioId]
    );

    return result.rows;
  },

  // Eliminar notificación
  async delete(id, usuarioId) {
    const result = await pool.query(
      `DELETE FROM notificaciones 
       WHERE id = $1 AND usuario_id = $2
       RETURNING *`,
      [id, usuarioId]
    );

    return result.rows[0];
  },

  // Crear notificación
  async create(notificationData) {
    const { 
      usuario_id, 
      titulo, 
      mensaje, 
      tipo, 
      canal,
      ticket_id,
      condominio_id,
      metadata 
    } = notificationData;

    const result = await pool.query(
      `INSERT INTO notificaciones 
       (usuario_id, titulo, mensaje, tipo, canal, ticket_id, condominio_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [usuario_id, titulo, mensaje, tipo, canal, ticket_id, condominio_id, metadata ? JSON.stringify(metadata) : null]
    );

    return result.rows[0];
  }
};

module.exports = Notification;