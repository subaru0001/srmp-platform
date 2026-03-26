const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { scopeByCondominio } = require('../middleware/condominioScope');

// Todas las rutas de residentes requieren autenticación y filtro por condominio
router.get('/unit/:unitId', 
  verifyToken,              // ← Requiere autenticación
  scopeByCondominio,        // ← Aplica filtro por condominio
  residentController.listByUnit
);

router.get('/:id', 
  verifyToken,              // ← Requiere autenticación
  scopeByCondominio,        // ← Aplica filtro por condominio
  residentController.getById
);

// Solo Admin o Super Admin puede crear/actualizar residentes
router.post('/', 
  verifyToken, 
  checkRole('admin'),       // ← Solo admins
  scopeByCondominio,        // ← Filtra por condominio del admin
  residentController.create
);

router.put('/:id', 
  verifyToken, 
  checkRole('admin'),       // ← Solo admins
  scopeByCondominio,        // ← Filtra por condominio del admin
  residentController.update
);

module.exports = router;