const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { scopeByCondominio } = require('../middleware/condominioScope');

// Todas las rutas de tickets requieren autenticación
router.get('/', 
  verifyToken,
  scopeByCondominio,
  ticketController.list
);

router.get('/stats', 
  verifyToken,
  checkRole('admin'),
  scopeByCondominio,
  ticketController.getStats
);

router.get('/:id', 
  verifyToken,
  scopeByCondominio,
  ticketController.getById
);

// Residentes y Admins pueden crear tickets
router.post('/', 
  verifyToken,
  scopeByCondominio,
  ticketController.create
);

// Admin o personal asignado puede actualizar
router.put('/:id', 
  verifyToken,
  scopeByCondominio,
  ticketController.update
);

// Solo Admin puede eliminar
router.delete('/:id', 
  verifyToken,
  checkRole('admin'),
  scopeByCondominio,
  ticketController.delete
);

module.exports = router;