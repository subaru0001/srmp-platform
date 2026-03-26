const pool = require('../config/database');

const User = {
  // Crear un nuevo usuario
  async create(userData) {
    const { email, password_hash, nombres, apellidos, telefono, rol, condominio_id } = userData;
    
    const result = await pool.query(
      `INSERT INTO usuarios (email, password_hash, nombres, apellidos, telefono, rol, condominio_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, nombres, apellidos, telefono, rol, condominio_id, estado, fecha_creacion`,
      [email, password_hash, nombres, apellidos, telefono, rol || 'residente', condominio_id || null]
    );
    
    return result.rows[0];
  },

  // Buscar usuario por email
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  },

  // Buscar usuario por ID (sin password_hash por seguridad)
  async findById(id) {
    const result = await pool.query(
      `SELECT id, email, nombres, apellidos, telefono, rol, estado, condominio_id, fecha_creacion 
       FROM usuarios WHERE id = $1`,
      [id]
    );
    
    return result.rows[0];
  },

  // Actualizar usuario
  async update(id, userData) {
    const { nombres, apellidos, telefono, rol, estado, condominio_id } = userData;
    
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombres = $1, apellidos = $2, telefono = $3, rol = $4, estado = $5, 
           condominio_id = $6, fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, email, nombres, apellidos, telefono, rol, condominio_id, estado, fecha_actualizacion`,
      [nombres, apellidos, telefono, rol, estado, condominio_id, id]
    );
    
    return result.rows[0];
  }
};

module.exports = User;