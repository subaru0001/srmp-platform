const pool = require('../config/database');

const Condo = {
  // Obtener todos los condominios
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM condominios WHERE estado = $1 ORDER BY nombre',
      ['activo']
    );
    return result.rows;
  },

  // Buscar condominio por ID
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM condominios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Crear nuevo condominio
  async create(condoData) {
    const { nombre, direccion, ciudad, pais, telefono, email } = condoData;
    
    const result = await pool.query(
      `INSERT INTO condominios (nombre, direccion, ciudad, pais, telefono, email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, direccion, ciudad, pais || 'Perú', telefono, email]
    );
    
    return result.rows[0];
  },

  // Actualizar condominio
  async update(id, condoData) {
    const { nombre, direccion, ciudad, pais, telefono, email, estado } = condoData;
    
    const result = await pool.query(
      `UPDATE condominios 
       SET nombre = $1, direccion = $2, ciudad = $3, pais = $4, 
           telefono = $5, email = $6, estado = $7, 
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [nombre, direccion, ciudad, pais, telefono, email, estado, id]
    );
    
    return result.rows[0];
  },

  // Eliminar condominio (soft delete)
  async delete(id) {
    const result = await pool.query(
      `UPDATE condominios 
       SET estado = 'inactivo', fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    return result.rows[0];
  }
};

module.exports = Condo;