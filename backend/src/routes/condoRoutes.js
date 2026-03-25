const express = require('express');
const router = express.Router();
const condoController = require('../controllers/condoController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Rutas públicas (solo lectura)
router.get('/', condoController.list);
router.get('/:id', condoController.getById);

// Rutas protegidas - Solo ADMIN
router.post('/', 
  verifyToken, 
  checkRole('admin'), 
  condoController.create
);

router.put('/:id', 
  verifyToken, 
  checkRole('admin'), 
  condoController.update
);

router.delete('/:id', 
  verifyToken, 
  checkRole('admin'), 
  condoController.delete
);

module.exports = router;