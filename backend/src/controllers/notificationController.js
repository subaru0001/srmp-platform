const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');
const { applyCondominioScope } = require('../middleware/condominioScope');
const pool = require('../config/database');

const notificationController = {
  list: async (req, res) => {
    try {
      const { leido, page = 1, limit = 20 } = req.query;
      const usuarioId = req.user.userId;

      const notifications = await Notification.findByUserId(usuarioId, {
        leido: leido !== undefined ? leido === 'true' : null,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      const unreadCount = await Notification.getUnreadCount(usuarioId);

      res.json({
        message: '✅ Notificaciones obtenidas',
        success: true,
        data: {
          count: notifications.length,
          unread: unreadCount,
          page: parseInt(page),
          limit: parseInt(limit),
          notifications
        }
      });
    } catch (error) {
      console.error('Error al listar notificaciones:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.userId;

      const notification = await Notification.findById(id, usuarioId);

      if (!notification) {
        return res.status(404).json({
          message: '❌ Notificación no encontrada',
          success: false
        });
      }

      res.json({
        message: '✅ Notificación obtenida',
        success: true,
        data: { notification }
      });
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.userId;

      const notification = await Notification.markAsRead(id, usuarioId);

      if (!notification) {
        return res.status(404).json({
          message: '❌ Notificación no encontrada',
          success: false
        });
      }

      res.json({
        message: '✅ Notificación marcada como leída',
        success: true,
        data: { notification }
      });
    } catch (error) {
      console.error('Error al marcar notificación:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      const usuarioId = req.user.userId;

      const notifications = await Notification.markAllAsRead(usuarioId);

      res.json({
        message: `✅ ${notifications.length} notificaciones marcadas como leídas`,
        success: true,
        data: { count: notifications.length }
      });
    } catch (error) {
      console.error('Error al marcar todas las notificaciones:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.userId;

      const notification = await Notification.delete(id, usuarioId);

      if (!notification) {
        return res.status(404).json({
          message: '❌ Notificación no encontrada',
          success: false
        });
      }

      res.json({
        message: '✅ Notificación eliminada',
        success: true,
        data: { notification }
      });
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  sendEmergency: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          message: '❌ Acceso denegado: Solo admin puede enviar emergencias',
          success: false
        });
      }

      const { condominio_id, titulo, mensaje } = req.body;

      if (!condominio_id || !titulo || !mensaje) {
        return res.status(400).json({
          message: '❌ Condominio, título y mensaje son requeridos',
          success: false
        });
      }

      if (!req.isSuperAdmin && req.condominioScope && condominio_id !== req.condominioScope) {
        return res.status(403).json({
          message: '❌ Acceso denegado: No puedes enviar emergencias a este condominio',
          success: false
        });
      }

      const result = await notificationService.notifyEmergency(condominio_id, titulo, mensaje);

      res.json({
        message: `✅ Emergencia enviada a ${result.count} residentes`,
        success: true,
        data: { count: result.count }
      });
    } catch (error) {
      console.error('Error al enviar emergencia:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  getUnreadCount: async (req, res) => {
    try {
      const usuarioId = req.user.userId;
      const count = await Notification.getUnreadCount(usuarioId);

      res.json({
        message: '✅ Conteo obtenido',
        success: true,
        data: { unread: count }
      });
    } catch (error) {
      console.error('Error al obtener conteo:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = notificationController;