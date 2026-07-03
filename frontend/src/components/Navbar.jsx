import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
    { name: 'Feedback', path: '/feedback' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="glass-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 800,
          fontSize: '1.4rem',
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            color: '#ffffff',
            width: '42px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.05rem',
            letterSpacing: '-0.5px',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
            flexShrink: 0
          }}>
            YB
          </div>
          <span>YnotB <span style={{ color: 'var(--accent-primary)' }}>Portfolio</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '24px'
        }} className="desktop-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                fontWeight: 500,
                color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                fontSize: '0.95rem'
              })}
              className="nav-item-hover"
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
              <Link to="/admin/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                color: 'var(--accent-primary)',
                fontWeight: 600
              }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.9rem'
              }} title="Logout">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 12px'
            }}>
              Console
            </Link>
          )}
        </div>

        {/* Hamburger Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'none'
          }}
          className="mobile-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          right: 0,
          background: 'rgba(9, 13, 22, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                fontWeight: 600,
                color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                fontSize: '1.1rem'
              })}
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Signed in as: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{user.name}</span>
              </div>
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--accent-primary)',
                  fontWeight: 600
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard Console
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  textAlign: 'left'
                }}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              style={{
                textAlign: 'center',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              Team Console Login
            </Link>
          )}
        </div>
      )}

      {/* Embedded CSS for responsive mobile menu */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        .nav-item-hover:hover {
          color: var(--text-primary) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
