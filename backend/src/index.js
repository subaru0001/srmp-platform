const express = require('express');
const cors = require('cors');
require('dotenv').config();

const testRoutes = require('./routes/testRoutes');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/test', testRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    project: 'SRMP - Smart Residential Management Platform',
    status: 'Running',
    endpoints: {
      hello: '/api/test/hello',
      db: '/api/test/db'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Proyecto: SRMP`);
});