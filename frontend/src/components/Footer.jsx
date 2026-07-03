import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(17, 24, 39, 0.95)',
      borderTop: '1px solid var(--border-color)',
      padding: '48px 0 24px 0',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Logo & Agency Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              fontFamily: 'var(--font-display)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                width: '36px',
                height: '30px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.85rem',
                letterSpacing: '-0.5px',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)',
                flexShrink: 0
              }}>
                YB
              </div>
              <span>YnotB <span style={{ color: 'var(--accent-primary)' }}>Portfolio</span></span>
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '0' }}>
              We design and construct high-performance digital applications, APIs, and responsive mobile platforms for growth-focused organizations.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.95rem' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/" className="footer-link">Home Portal</Link>
              <Link to="/services" className="footer-link">Our Services</Link>
              <Link to="/portfolio" className="footer-link">Portfolio & Works</Link>
              <Link to="/team" className="footer-link">Engineering Team</Link>
              <Link to="/about" className="footer-link">About Agency</Link>
              <Link to="/feedback" className="footer-link">Client Feedback</Link>
            </div>
          </div>

          {/* Support / Contact */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.95rem' }}>Contact Info</h4>
            <p style={{ marginBottom: '12px' }}>Have an upcoming product idea? Let us construct it together.</p>
            <p style={{ color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '8px' }}>thiruverakants@gmail.com</p>
            <p style={{ marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>+94 0764609326</p>
            <p>Inuvil, Jaffna, Sri Lanka</p>
          </div>
        </div>

        {/* Copyright notice */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }} className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} YnotB Portfolio. All rights reserved.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Empowering innovation through software. Made from scratch with React & Node.
          </p>
        </div>
      </div>
      <style>{`
        .footer-link:hover {
          color: var(--accent-secondary) !important;
          transform: translateX(4px);
        }
        .social-icon:hover {
          color: var(--text-primary) !important;
        }
        @media (min-width: 600px) {
          .footer-bottom {
            flex-direction: row !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
