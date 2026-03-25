const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_123';

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        message: '❌ No se proporcionó token de autenticación',
        success: false
      });
    }

    // El formato es: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: '❌ Token inválido',
        success: false
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '❌ Token expirado',
        success: false
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: '❌ Token inválido',
        success: false
      });
    }

    console.error('Error en verifyToken:', error);
    res.status(500).json({
      message: '❌ Error interno del servidor',
      error: error.message,
      success: false
    });
  }
};

// Middleware para verificar roles
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: '❌ No autenticado',
        success: false
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `❌ Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
        success: false
      });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };