import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, X, AlertTriangle, Ticket, Info } from 'lucide-react';

const Notifications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const [notifResponse, countResponse] = await Promise.all([
        notificationService.getAll(),
        notificationService.getUnreadCount()
      ]);
      
      if (notifResponse.success) {
        setNotifications(notifResponse.data.notifications);
      }
      if (countResponse.success) {
        setUnreadCount(countResponse.data.unread);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        loadNotifications();
      }
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        loadNotifications();
      }
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const getIconByType = (tipo) => {
    switch (tipo) {
      case 'ticket': return <Ticket className="w-5 h-5" />;
      case 'emergencia': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getColorByType = (tipo) => {
    switch (tipo) {
      case 'ticket': return 'bg-blue-100 text-blue-600';
      case 'emergencia': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-800">
                ← Volver
              </button>
              <h1 className="text-xl font-bold text-blue-600">SRMP Platform</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.nombres} {user.apellidos}
              </span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notificaciones</h2>
            <p className="text-gray-600">
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificación(es) no leída(s)` 
                : 'Todas las notificaciones están leídas'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <CheckCheck className="w-5 h-5" />
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm p-6 transition ${
                !notification.leido ? 'border-l-4 border-blue-500' : 'opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getColorByType(notification.tipo)}`}>
                  {getIconByType(notification.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{notification.titulo}</h3>
                      <p className="text-gray-600 mt-1">{notification.mensaje}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(notification.fecha_creacion).toLocaleString()}
                      </p>
                    </div>
                    {!notification.leido && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Marcar como leída"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tienes notificaciones</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;