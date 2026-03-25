const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_2026';

const authController = {
  // REGISTRO DE USUARIO
  register: async (req, res) => {
    try {
      const { email, password, nombres, apellidos, telefono, rol } = req.body;

      // Validar campos requeridos
      if (!email || !password || !nombres || !apellidos) {
        return res.status(400).json({
          message: '❌ Email, contraseña, nombres y apellidos son requeridos',
          success: false
        });
      }

      // Validar que el email no exista
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: '❌ El email ya está registrado',
          success: false
        });
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Crear usuario
      const newUser = await User.create({
        email,
        password_hash,
        nombres,
        apellidos,
        telefono: telefono || null,
        rol: rol || 'residente'
      });

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.rol 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: '✅ Usuario registrado exitosamente',
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            nombres: newUser.nombres,
            apellidos: newUser.apellidos,
            rol: newUser.rol
          },
          token
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // LOGIN DE USUARIO
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validar campos
      if (!email || !password) {
        return res.status(400).json({
          message: '❌ Email y contraseña son requeridos',
          success: false
        });
      }

      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: '❌ Credenciales inválidas',
          success: false
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          message: '❌ Credenciales inválidas',
          success: false
        });
      }

      // Verificar que el usuario esté activo
      if (user.estado !== 'activo') {
        return res.status(403).json({
          message: '❌ Usuario inactivo o suspendido',
          success: false
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.rol 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: '✅ Login exitoso',
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            rol: user.rol
          },
          token
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // OBTENER PERFIL DEL USUARIO
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          message: '❌ Usuario no encontrado',
          success: false
        });
      }

      res.json({
        message: '✅ Perfil obtenido',
        success: true,
        data: {
          user
        }
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = authController;