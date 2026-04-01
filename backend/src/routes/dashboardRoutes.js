const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { scopeByCondominio } = require('../middleware/condominioScope');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Estadísticas para admin
router.get('/admin', 
  checkRole('admin'),
  scopeByCondominio,
  dashboardController.getAdminStats
);

// Estadísticas para residente
router.get('/resident', 
  dashboardController.getResidentStats
);

// Estadísticas por período
router.get('/stats-by-period', 
  checkRole('admin'),
  scopeByCondominio,
  dashboardController.getStatsByPeriod
);

// Estadísticas de personal
router.get('/personal', 
  checkRole('admin'),
  scopeByCondominio,
  dashboardController.getPersonalStats
);

module.exports = router;