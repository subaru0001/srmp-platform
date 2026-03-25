const pool = require('../config/database');

const Unit = {
  // Obtener unidades de un condominio
  async findByCondo(condoId) {
    const result = await pool.query(
      `SELECT u.*, c.nombre as condominio_nombre 
       FROM unidades u
       JOIN condominios c ON u.condominio_id = c.id
       WHERE u.condominio_id = $1
       ORDER BY u.torre, u.piso, u.numero_unidad`,
      [condoId]
    );
    return result.rows;
  },

  // Buscar unidad por ID
  async findById(id) {
    const result = await pool.query(
      `SELECT u.*, c.nombre as condominio_nombre 
       FROM unidades u
       JOIN condominios c ON u.condominio_id = c.id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Crear nueva unidad
  async create(unitData) {
    const { condominio_id, numero_unidad, torre, piso, area_m2, estado } = unitData;
    
    const result = await pool.query(
      `INSERT INTO unidades (condominio_id, numero_unidad, torre, piso, area_m2, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [condominio_id, numero_unidad, torre, piso, area_m2, estado || 'ocupada']
    );
    
    return result.rows[0];
  },

  // Actualizar unidad
  async update(id, unitData) {
    const { numero_unidad, torre, piso, area_m2, estado } = unitData;
    
    const result = await pool.query(
      `UPDATE unidades 
       SET numero_unidad = $1, torre = $2, piso = $3, 
           area_m2 = $4, estado = $5, 
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [numero_unidad, torre, piso, area_m2, estado, id]
    );
    
    return result.rows[0];
  }
};

module.exports = Unit;