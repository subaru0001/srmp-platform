const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', verifyToken, authController.getProfile);

// Ruta solo para admins
router.get('/admins-only', verifyToken, checkRole('admin'), (req, res) => {
  res.json({
    message: '✅ Bienvenido administrador',
    success: true,
    data: {
      user: req.user
    }
  });
});

module.exports = router;