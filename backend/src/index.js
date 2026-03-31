const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const condoRoutes = require('./routes/condoRoutes');
const residentRoutes = require('./routes/residentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');  // ← NUEVO: Rutas de tickets

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
app.use('/api/condos', condoRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/tickets', ticketRoutes);  // ← NUEVO: Registrar rutas de tickets

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
      condos: {
        list: 'GET /api/condos (auth + token)',
        getById: 'GET /api/condos/:id (auth + token)',
        create: 'POST /api/condos (admin + token)',
        update: 'PUT /api/condos/:id (admin + token)',
        delete: 'DELETE /api/condos/:id (admin + token)'
      },
      residents: {
        listByUnit: 'GET /api/residents/unit/:unitId (auth + token)',
        getById: 'GET /api/residents/:id (auth + token)',
        create: 'POST /api/residents (admin + token)',
        update: 'PUT /api/residents/:id (admin + token)'
      },
      tickets: {  // ← NUEVO: Endpoints de tickets
        list: 'GET /api/tickets (auth + token)',
        stats: 'GET /api/tickets/stats (admin + token)',
        getById: 'GET /api/tickets/:id (auth + token)',
        create: 'POST /api/tickets (auth + token)',
        update: 'PUT /api/tickets/:id (auth + token)',
        delete: 'DELETE /api/tickets/:id (admin + token)'
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
  console.log(`🏢 Módulos: Auth, Condos, Residents, Tickets`);  // ← ACTUALIZADO
});