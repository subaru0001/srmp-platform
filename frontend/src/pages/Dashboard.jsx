import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LogOut, Ticket, Bell, Users, Home, TrendingUp, Shield, Building2 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      let response;
      if (user?.rol === 'admin') {
        response = await dashboardService.getAdminStats();
      } else if (user?.rol === 'personal') {
        response = await dashboardService.getPersonalStats();
      } else {
        response = await dashboardService.getResidentStats();
      }
      
      if (response?.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f5f9'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #2563eb',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Navbar */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Building2 size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a' }}>SRMP Platform</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                {user?.nombres} {user?.apellidos}
              </span>
              <RoleBadge role={user?.rol} />
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fee2e2';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fef2f2';
              }}
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px' }}>
            Bienvenido, {user?.nombres} 👋
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {user?.rol === 'admin' 
              ? 'Panel de administración del condominio' 
              : user?.rol === 'personal'
              ? 'Panel de personal de mantenimiento'
              : 'Panel del residente'}
          </p>
        </div>

        {/* KPI Cards - Admin */}
        {user?.rol === 'admin' && stats?.kpis && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <KpiCard
              icon={Ticket}
              title="Total Tickets"
              value={stats.kpis.totalTickets}
              iconColor="#2563eb"
              bgColor="#dbeafe"
            />
            <KpiCard
              icon={Users}
              title="Residentes"
              value={stats.kpis.totalResidentes}
              iconColor="#16a34a"
              bgColor="#dcfce7"
            />
            <KpiCard
              icon={Home}
              title="Unidades"
              value={stats.kpis.totalUnidades}
              iconColor="#9333ea"
              bgColor="#f3e8ff"
            />
            <KpiCard
              icon={TrendingUp}
              title="Sin Asignar"
              value={stats.kpis.ticketsSinAsignar}
              iconColor="#d97706"
              bgColor="#fef3c7"
            />
          </div>
        )}

        {/* KPI Cards - Personal */}
        {user?.rol === 'personal' && stats?.personal && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {stats.personal
              .filter(p => p.id === user?.id)
              .map(p => (
                <React.Fragment key={p.id}>
                  <KpiCard
                    icon={Ticket}
                    title="Tickets Asignados"
                    value={p.ticketsAsignados}
                    iconColor="#2563eb"
                    bgColor="#dbeafe"
                  />
                  <KpiCard
                    icon={TrendingUp}
                    title="En Progreso"
                    value={p.ticketsAsignados - p.ticketsResueltos}
                    iconColor="#d97706"
                    bgColor="#fef3c7"
                  />
                  <KpiCard
                    icon={Shield}
                    title="Resueltos"
                    value={p.ticketsResueltos}
                    iconColor="#16a34a"
                    bgColor="#dcfce7"
                  />
                </React.Fragment>
              ))}
          </div>
        )}

        {/* KPI Cards - Residente */}
        {user?.rol === 'residente' && stats?.kpis && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <KpiCard
              icon={Ticket}
              title="Mis Tickets"
              value={stats.kpis.totalTickets}
              iconColor="#2563eb"
              bgColor="#dbeafe"
            />
            <KpiCard
              icon={Bell}
              title="Abiertos"
              value={stats.kpis.ticketsAbiertos}
              iconColor="#d97706"
              bgColor="#fef3c7"
            />
            <KpiCard
              icon={Bell}
              title="Notificaciones"
              value={stats.kpis.notificacionesNoLeidas}
              iconColor="#dc2626"
              bgColor="#fee2e2"
            />
          </div>
        )}

        {/* Navigation Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <NavCard
            title="Tickets"
            description="Gestionar y ver tickets"
            icon={Ticket}
            iconColor="#2563eb"
            onClick={() => navigate('/tickets')}
          />
          <NavCard
            title="Notificaciones"
            description="Ver notificaciones"
            icon={Bell}
            iconColor="#d97706"
            onClick={() => navigate('/notifications')}
          />
          {user?.rol === 'admin' && (
            <NavCard
              title="Estadísticas"
              description="Ver estadísticas detalladas"
              icon={TrendingUp}
              iconColor="#16a34a"
              onClick={() => navigate('/dashboard')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// Componente KpiCard
const KpiCard = ({ icon: Icon, title, value, iconColor, bgColor }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px' }}>{title}</p>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{value}</p>
      </div>
      <div style={{
        padding: '12px',
        borderRadius: '10px',
        background: bgColor
      }}>
        <Icon size={24} style={{ color: iconColor }} />
      </div>
    </div>
  );
};

// Componente NavCard
const NavCard = ({ title, description, icon: Icon, iconColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        padding: '12px',
        borderRadius: '10px',
        background: `${iconColor}15`
      }}>
        <Icon size={24} style={{ color: iconColor }} />
      </div>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{description}</p>
      </div>
    </div>
  );
};

// Componente RoleBadge
const RoleBadge = ({ role }) => {
  const roleConfig = {
    admin: { label: 'Admin', color: '#9333ea', bg: '#f3e8ff' },
    personal: { label: 'Personal', color: '#2563eb', bg: '#eff6ff' },
    residente: { label: 'Residente', color: '#16a34a', bg: '#f0fdf4' }
  };

  const config = roleConfig[role] || roleConfig.residente;

  return (
    <span style={{
      fontSize: '11px',
      fontWeight: '600',
      padding: '4px 10px',
      borderRadius: '9999px',
      background: config.bg,
      color: config.color,
      textTransform: 'uppercase'
    }}>
      {config.label}
    </span>
  );
};

export default Dashboard;