import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Ticket, Plus, Clock, CheckCircle, AlertCircle, X, Bell } from 'lucide-react';

const Tickets = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'mantenimiento',
    prioridad: 'media',
    residente_id: ''
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await ticketService.getAll();
      if (response.success) {
        setTickets(response.data.tickets);
      }
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    // Si es admin y no seleccionó residente, usar uno por defecto
    const ticketData = { ...newTicket };
    if (user?.rol === 'admin' && !ticketData.residente_id) {
      ticketData.residente_id = 2; // Residente por defecto (cambiar según necesites)
    }
    
    try {
      const response = await ticketService.create(ticketData);
      if (response.success) {
        alert('✅ Ticket creado exitosamente');
        setShowModal(false);
        loadTickets();
        setNewTicket({ 
          titulo: '', 
          descripcion: '', 
          categoria: 'mantenimiento', 
          prioridad: 'media',
          residente_id: ''
        });
      }
    } catch (error) {
      alert('❌ Error al crear ticket: ' + error.response?.data?.message);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'abierto': return 'bg-yellow-100 text-yellow-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'resuelto': return 'bg-green-100 text-green-800';
      case 'eliminado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 text-gray-600 hover:text-blue-600"
              >
                <Bell className="w-6 h-6" />
              </button>
              <span className="text-sm text-gray-600">
                {user?.nombres} {user?.apellidos}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tickets</h2>
            <p className="text-gray-600">Gestiona los tickets de mantenimiento</p>
          </div>
          {user?.rol !== 'personal' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Nuevo Ticket
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total"
            value={tickets.length}
            icon={Ticket}
            color="blue"
          />
          <StatCard
            title="Abiertos"
            value={tickets.filter(t => t.estado === 'abierto').length}
            icon={AlertCircle}
            color="yellow"
          />
          <StatCard
            title="En Progreso"
            value={tickets.filter(t => t.estado === 'en_progreso').length}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Resueltos"
            value={tickets.filter(t => t.estado === 'resuelto').length}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">#{ticket.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.titulo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.categoria}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.prioridad)}`}>
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.estado)}`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(ticket.fecha_creacion).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tickets.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay tickets registrados</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Nuevo Ticket */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Nuevo Ticket</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newTicket.titulo}
                  onChange={(e) => setNewTicket({...newTicket, titulo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Grifo goteando en cocina"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={newTicket.descripcion}
                  onChange={(e) => setNewTicket({...newTicket, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Describe el problema..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={newTicket.categoria}
                  onChange={(e) => setNewTicket({...newTicket, categoria: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="seguridad">Seguridad</option>
                  <option value="servicios">Servicios</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                <select
                  value={newTicket.prioridad}
                  onChange={(e) => setNewTicket({...newTicket, prioridad: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              
              {/* Selector de Residente (Solo para Admin) */}
              {user?.rol === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residente
                  </label>
                  <select
                    value={newTicket.residente_id}
                    onChange={(e) => setNewTicket({...newTicket, residente_id: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar residente...</option>
                    <option value="2">Juan Carlos Pérez</option>
                    <option value="3">María Elena García</option>
                    <option value="4">Test Residente</option>
                    <option value="8">Tu Amigo</option>
                  </select>
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Crear Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente StatCard
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Tickets;