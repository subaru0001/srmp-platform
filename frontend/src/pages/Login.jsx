import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Building2, Shield, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Login Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '420px',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          padding: '32px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Building2 size={32} color="white" />
          </div>
          <h1 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 4px'
          }}>
            SRMP Platform
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '13px',
            margin: 0
          }}>
            Gestión Residencial Inteligente
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 24px' }}>
          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="ejemplo@correo.com"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="••••••••"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#93c5fd' : '#2563eb',
                color: 'white',
                fontWeight: '500',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#2563eb';
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Iniciando...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            gap: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Credenciales de Prueba
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Demo Credentials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <CredentialRow
              icon={Shield}
              role="Administrador"
              email="admin.laspalmas@srmp.com"
              iconColor="#9333ea"
              bgColor="#f5f3ff"
            />
            <CredentialRow
              icon={Building2}
              role="Vigilante"
              email="vigilante@srmp.com"
              iconColor="#2563eb"
              bgColor="#eff6ff"
            />
            <CredentialRow
              icon={User}
              role="Residente"
              email="test.residente@srmp.com"
              iconColor="#16a34a"
              bgColor="#f0fdf4"
            />
          </div>

          {/* Password Note */}
          <div style={{
            marginTop: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#4b5563',
              margin: 0
            }}>
              <strong>Contraseñas:</strong>{' '}
              <code style={{
                background: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                margin: '0 2px'
              }}>admin123</code>{' '}
              <code style={{
                background: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                margin: '0 2px'
              }}>test123</code>{' '}
              <code style={{
                background: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                margin: '0 2px'
              }}>vigilante123</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f9fafb',
          padding: '16px 24px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#9ca3af',
            margin: 0
          }}>
            © 2026 SRMP Platform • Todos los derechos reservados
          </p>
        </div>
      </div>

      {/* Spin Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Componente CredentialRow
const CredentialRow = ({ icon: Icon, role, email, iconColor, bgColor }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      borderRadius: '8px',
      background: bgColor
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={16} style={{ color: iconColor }} />
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: '#374151'
        }}>
          {role}
        </span>
      </div>
      <span style={{
        fontSize: '11px',
        color: '#6b7280',
        fontFamily: 'monospace'
      }}>
        {email}
      </span>
    </div>
  );
};

export default Login;