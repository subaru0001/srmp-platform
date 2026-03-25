const pool = require('../config/database');

const testController = {
  // Endpoint de saludo
  hello: (req, res) => {
    res.json({
      message: '¡Hola! SRMP Backend está funcionando 🚀',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  },

  // Endpoint para probar conexión a DB
  testDB: async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      
      res.json({
        message: '✅ Conexión a PostgreSQL exitosa',
        database_time: result.rows[0].now
      });
    } catch (error) {
      res.status(500).json({
        message: '❌ Error de conexión',
        error: error.message
      });
    }
  }
};

module.exports = testController;