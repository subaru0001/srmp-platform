const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { scopeByCondominio } = require('../middleware/condominioScope');

// Todas las rutas de notificaciones requieren autenticación
router.get('/', 
  verifyToken,
  notificationController.list
);

router.get('/unread-count', 
  verifyToken,
  notificationController.getUnreadCount
);

router.get('/:id', 
  verifyToken,
  notificationController.getById
);

router.put('/:id/read', 
  verifyToken,
  notificationController.markAsRead
);

router.put('/read-all', 
  verifyToken,
  notificationController.markAllAsRead
);

router.delete('/:id', 
  verifyToken,
  notificationController.delete
);

// Solo admin puede enviar emergencias
router.post('/emergency', 
  verifyToken,
  checkRole('admin'),
  scopeByCondominio,
  notificationController.sendEmergency
);

module.exports = router;