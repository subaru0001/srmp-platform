const pool = require('../config/database');

const Resident = {
  // Obtener residentes de una unidad
  async findByUnit(unitId) {
    const result = await pool.query(
      `SELECT r.*, u.numero_unidad, u.torre, 
              us.nombres, us.apellidos, us.email, us.rol
       FROM residentes r
       JOIN unidades u ON r.unidad_id = u.id
       JOIN usuarios us ON r.usuario_id = us.id
       WHERE r.unidad_id = $1 AND r.estado = 'activo'`,
      [unitId]
    );
    return result.rows;
  },

  // Buscar residente por ID
  async findById(id) {
    const result = await pool.query(
      `SELECT r.*, u.numero_unidad, u.torre, u.condominio_id,
              us.nombres, us.apellidos, us.email, us.rol, us.telefono
       FROM residentes r
       JOIN unidades u ON r.unidad_id = u.id
       JOIN usuarios us ON r.usuario_id = us.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Crear nuevo residente
  async create(residentData) {
    const { usuario_id, unidad_id, tipo_vinculo, fecha_ingreso } = residentData;
    
    const result = await pool.query(
      `INSERT INTO residentes (usuario_id, unidad_id, tipo_vinculo, fecha_ingreso)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [usuario_id, unidad_id, tipo_vinculo || 'propietario', fecha_ingreso || new Date()]
    );
    
    return result.rows[0];
  },

  // Actualizar residente
  async update(id, residentData) {
    const { tipo_vinculo, fecha_ingreso, fecha_salida, estado } = residentData;
    
    const result = await pool.query(
      `UPDATE residentes 
       SET tipo_vinculo = $1, fecha_ingreso = $2, 
           fecha_salida = $3, estado = $4,
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [tipo_vinculo, fecha_ingreso, fecha_salida, estado, id]
    );
    
    return result.rows[0];
  }
};

module.exports = Resident;