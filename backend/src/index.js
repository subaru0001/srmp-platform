const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');

// ← NUEVO: Importar rutas de condominios y residentes
const condoRoutes = require('./routes/condoRoutes');
const residentRoutes = require('./routes/residentRoutes');

// Importar configuración de DB
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

// ← NUEVO: Rutas de condominios y residentes
app.use('/api/condos', condoRoutes);
app.use('/api/residents', residentRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    project: 'SRMP - Smart Residential Management Platform',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      test: {
        hello: 'GET /api/test/hello',
        db: 'GET /api/test/db'
      },
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requiere token)'
      },
      // ← NUEVO: Endpoints de condominios
      condos: {
        list: 'GET /api/condos (público)',
        getById: 'GET /api/condos/:id (público)',
        create: 'POST /api/condos (admin + token)',
        update: 'PUT /api/condos/:id (admin + token)',
        delete: 'DELETE /api/condos/:id (admin + token)'
      },
      // ← NUEVO: Endpoints de residentes
      residents: {
        listByUnit: 'GET /api/residents/unit/:unitId (auth + token)',
        getById: 'GET /api/residents/:id (auth + token)',
        create: 'POST /api/residents (admin + token)',
        update: 'PUT /api/residents/:id (admin + token)'
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

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    message: '❌ Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error inesperado',
    success: false
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Proyecto: SRMP`);
  console.log(`🔐 Autenticación JWT habilitada`);
  console.log(`🏢 Módulos: Auth, Condos, Residents`);  // ← NUEVO
});