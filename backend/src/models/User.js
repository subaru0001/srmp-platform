const pool = require('../config/database');

const User = {
  // Crear un nuevo usuario
  async create(userData) {
    const { email, password_hash, nombres, apellidos, telefono, rol } = userData;
    
    const result = await pool.query(
      `INSERT INTO usuarios (email, password_hash, nombres, apellidos, telefono, rol) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, nombres, apellidos, telefono, rol, estado, fecha_creacion`,
      [email, password_hash, nombres, apellidos, telefono, rol || 'residente']
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
      `SELECT id, email, nombres, apellidos, telefono, rol, estado, fecha_creacion 
       FROM usuarios WHERE id = $1`,
      [id]
    );
    
    return result.rows[0];
  },

  // Actualizar usuario
  async update(id, userData) {
    const { nombres, apellidos, telefono, rol, estado } = userData;
    
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombres = $1, apellidos = $2, telefono = $3, rol = $4, estado = $5, 
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, email, nombres, apellidos, telefono, rol, estado, fecha_actualizacion`,
      [nombres, apellidos, telefono, rol, estado, id]
    );
    
    return result.rows[0];
  }
};

module.exports = User;