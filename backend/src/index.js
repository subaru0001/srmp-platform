const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');  // ← NUEVO

// Importar configuración de DB
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);  // ← NUEVO: Rutas de autenticación

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    project: 'SRMP - Smart Residential Management Platform',
    status: 'Running',
    version: '1.0.0',  // ← NUEVO
    endpoints: {
      test: {  // ← AGRUPADO
        hello: '/api/test/hello',
        db: '/api/test/db'
      },
      auth: {  // ← NUEVO
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requiere token)'
      }
    }
  });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    message: '❌ Ruta no encontrada',
    success: false
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Proyecto: SRMP`);
  console.log(`🔐 Autenticación JWT habilitada`);  // ← NUEVO
  console.log(`🛡️  Middlewares de seguridad activos`);  // ← NUEVO
});