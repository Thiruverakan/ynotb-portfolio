import React, { useState } from 'react';
import { Mail, MapPin, Clock, Phone, Send, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { apiUrl } from '../config';


const Contact = () => {
  const [copiedItem, setCopiedItem] = useState(null);

  const handleCopy = (text, itemKey) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemKey);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    countryCode: '+94',
    phoneNum: '',
    whatsappAvailable: false
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    const phoneDigits = formData.phoneNum.replace(/\D/g, '');
    const isOnlyDigits = /^\d+$/.test(formData.phoneNum);
    
    if (!isOnlyDigits) {
      setStatus({ submitting: false, success: false, error: 'Phone number must contain only digits.' });
      return;
    }
    
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setStatus({ submitting: false, success: false, error: 'Phone number must be between 7 and 15 digits.' });
      return;
    }

    const fullPhone = formData.countryCode + phoneDigits;

    try {
      const res = await fetch(apiUrl('/api/messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          phone: fullPhone,
          whatsappAvailable: formData.whatsappAvailable
        })
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ submitting: false, success: true, error: null });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          countryCode: '+94',
          phoneNum: '',
          whatsappAvailable: false
        });
      } else {
        setStatus({ submitting: false, success: false, error: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ submitting: false, success: false, error: 'Connection failed. Please check your internet.' });
    }
  };

  return (
    <div className="container section-padding animate-fade-in">
      <span className="badge badge-cyan" style={{ display: 'block', margin: '0 auto 16px auto', width: 'fit-content' }}>Get in touch</span>
      <h1 className="section-title">Submit An Inquiry</h1>
      <p className="section-subtitle">Have a project or design in mind? Let us know what you are building. Our engineering team responds within 24 hours.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px',
        marginTop: '60px'
      }}>
        {/* Left Column: Form */}
        <div className="glass-card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Project Parameters</h2>

          {status.success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle size={20} />
              <span>Inquiry received! Our engineers will review your request.</span>
            </div>
          )}

          {status.error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertCircle size={20} />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Name / Institution</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                className="form-input"
                placeholder="e.g., Jane Watson"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Contact Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                className="form-input"
                placeholder="e.g., jane@watson.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phoneNum">Contact Phone</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  name="countryCode"
                  id="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="form-input"
                  style={{ width: '110px', height: '42px', padding: '0 8px', background: 'rgba(9, 13, 22, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                >
                  <option value="+94">+94 (LK)</option>
                  <option value="+91">+91 (IN)</option>
                  <option value="+44">+44 (GB)</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+60">+60 (MY)</option>
                </select>
                <input 
                  type="text" 
                  name="phoneNum" 
                  id="phoneNum" 
                  required 
                  value={formData.phoneNum} 
                  onChange={handleChange} 
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="e.g., 764609326"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Do you use WhatsApp on this number?</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <input
                    type="radio"
                    name="whatsappAvailable"
                    value="true"
                    checked={formData.whatsappAvailable === true}
                    onChange={() => setFormData({ ...formData, whatsappAvailable: true })}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-secondary)' }}
                  />
                  Yes
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <input
                    type="radio"
                    name="whatsappAvailable"
                    value="false"
                    checked={formData.whatsappAvailable === false}
                    onChange={() => setFormData({ ...formData, whatsappAvailable: false })}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-secondary)' }}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">Subject</label>
              <input 
                type="text" 
                name="subject" 
                id="subject" 
                required 
                value={formData.subject} 
                onChange={handleChange} 
                className="form-input"
                placeholder="e.g., Custom Telehealth Portal Development"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Message Specifications</label>
              <textarea 
                name="message" 
                id="message" 
                required 
                value={formData.message} 
                onChange={handleChange} 
                className="form-textarea"
                placeholder="Please outline the target features, database parameters, and timeline targets..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status.submitting} 
              className="glow-btn" 
              style={{
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                marginTop: '12px'
              }}
            >
              {status.submitting ? 'Transmitting...' : 'Send Inquiry'}
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Right Column: Contact Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Secure Portals</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              All message payloads are encrypted via SSL/TLS and saved securely in our databases. We do not share project specifications with third parties.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Card */}
            <div 
              className="contact-card-item" 
              onClick={() => handleCopy('thiruverakants@gmail.com', 'email')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{
                color: 'var(--accent-secondary)',
                background: 'rgba(6, 182, 212, 0.1)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mail size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>Email</span>
                  {copiedItem === 'email' ? (
                    <span style={{ color: 'var(--accent-secondary)', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}>Copied!</span>
                  ) : (
                    <span className="copy-hint" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0, transition: 'opacity 0.2s', textTransform: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Copy size={10} /> Click to copy
                    </span>
                  )}
                </h4>
                <p style={{ fontWeight: 600, color: '#ffffff', fontSize: '1.05rem', letterSpacing: '0.2px' }}>thiruverakants@gmail.com</p>
              </div>
            </div>

            {/* Address Card */}
            <div 
              className="contact-card-item purple-theme" 
              onClick={() => handleCopy('Inuvil, Jaffna, Sri Lanka', 'address')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{
                color: 'var(--accent-primary)',
                background: 'rgba(124, 58, 237, 0.1)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>Address</span>
                  {copiedItem === 'address' ? (
                    <span style={{ color: 'var(--accent-primary)', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}>Copied!</span>
                  ) : (
                    <span className="copy-hint" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0, transition: 'opacity 0.2s', textTransform: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Copy size={10} /> Click to copy
                    </span>
                  )}
                </h4>
                <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem', lineHeight: '1.4' }}>
                  Inuvil, Jaffna
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400, marginTop: '2px' }}>
                  Sri Lanka
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div 
              className="contact-card-item purple-theme" 
              onClick={() => handleCopy('+94 76 460 9326', 'phone')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{
                color: 'var(--accent-primary)',
                background: 'rgba(124, 58, 237, 0.1)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>Phone</span>
                  {copiedItem === 'phone' ? (
                    <span style={{ color: 'var(--accent-primary)', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}>Copied!</span>
                  ) : (
                    <span className="copy-hint" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0, transition: 'opacity 0.2s', textTransform: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Copy size={10} /> Click to copy
                    </span>
                  )}
                </h4>
                <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.15rem', letterSpacing: '0.8px' }}>+94 76 460 9326</p>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="contact-card-item">
              <div style={{
                color: 'var(--accent-secondary)',
                background: 'rgba(6, 182, 212, 0.1)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>Working Hours</h4>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Mon - Fri: 24 Hrs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
