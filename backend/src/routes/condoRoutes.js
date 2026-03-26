const express = require('express');
const router = express.Router();
const condoController = require('../controllers/condoController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { scopeByCondominio } = require('../middleware/condominioScope');

// Rutas protegidas con filtro por condominio
// (Ahora requieren token para aplicar el scope)
router.get('/', 
  verifyToken,           // ← AGREGAR: Requiere autenticación
  scopeByCondominio,     // ← AGREGAR: Aplica filtro por condominio
  condoController.list
);

router.get('/:id', 
  verifyToken,           // ← AGREGAR: Requiere autenticación
  scopeByCondominio,     // ← AGREGAR: Aplica filtro por condominio
  condoController.getById
);

// Rutas protegidas - Solo SUPER ADMIN puede crear/actualizar/eliminar
router.post('/', 
  verifyToken, 
  checkRole('admin'),
  scopeByCondominio,
  condoController.create
);

router.put('/:id', 
  verifyToken, 
  checkRole('admin'),
  scopeByCondominio,
  condoController.update
);

router.delete('/:id', 
  verifyToken, 
  checkRole('admin'),
  scopeByCondominio,
  condoController.delete
);

module.exports = router;