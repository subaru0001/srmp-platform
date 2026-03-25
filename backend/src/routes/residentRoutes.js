const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Rutas protegidas - Admin y Vigilante pueden leer
router.get('/unit/:unitId', 
  verifyToken, 
  checkRole('admin', 'vigilante'), 
  residentController.listByUnit
);

router.get('/:id', 
  verifyToken, 
  residentController.getById
);

// Rutas protegidas - Solo ADMIN puede crear/actualizar
router.post('/', 
  verifyToken, 
  checkRole('admin'), 
  residentController.create
);

router.put('/:id', 
  verifyToken, 
  checkRole('admin'), 
  residentController.update
);

module.exports = router;