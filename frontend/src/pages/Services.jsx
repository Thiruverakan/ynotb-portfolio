import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Brain, 
  Server, 
  Palette, 
  Megaphone, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
  Plus,
  Smartphone
} from 'lucide-react';
import { apiUrl } from '../config';

const Services = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(apiUrl('/api/services'));
        const data = await res.json();
        if (data.success) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFaq(index);
    }
  };

  const getServiceIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'code': return <Code2 size={28} />;
      case 'mobile': return <Smartphone size={28} />;
      case 'server': return <Server size={28} />;
      case 'palette': return <Palette size={28} />;
      case 'megaphone': return <Megaphone size={28} />;
      case 'graduationcap': return <GraduationCap size={28} />;
      default: return <Sparkles size={28} />;
    }
  };

  const getServiceTheme = (index) => {
    const isPurple = index % 2 === 1;
    return {
      theme: isPurple ? 'purple' : 'cyan',
      accentColor: isPurple ? 'var(--accent-primary)' : 'var(--accent-secondary)',
      bgColor: isPurple ? 'rgba(124, 58, 237, 0.08)' : 'rgba(6, 182, 212, 0.08)'
    };
  };

  const faqItems = [
    {
      q: "What types of projects do you develop?",
      a: "We engineer a wide range of custom software systems, including modern web portals, responsive single page applications (SPAs), cross-platform mobile apps for iOS & Android, custom cloud architectures, database schemas, and AI integrations."
    },
    {
      q: "Can you customize a solution for my requirements?",
      a: "Absolutely. Every application we construct is engineered from the ground up to solve your specific constraints, user flows, and database structures. We do not use rigid template defaults."
    },
    {
      q: "Do you provide support after project completion?",
      a: "Yes, we offer ongoing maintenance plans to monitor server health, apply database patches, backup files, and implement progressive feature updates as your project scale grows."
    },
    {
      q: "Can you improve or upgrade an existing project?",
      a: "Yes, our engineers specialize in refactoring legacy codebases, migrating local storage systems to modern databases, refreshing old UI/UX layouts, and connecting third-party APIs."
    },
    {
      q: "Do you work with both students and businesses?",
      a: "Yes. We work closely with university students on final-year engineering projects, academic spin-offs, and research models, as well as startups and SMBs looking to scale operations."
    },
    {
      q: "How do I get started?",
      a: "Simply reach out via our contact page. We will schedule a discovery consultation to review your project specifications, align on scope, and prepare a clean, step-by-step roadmap."
    }
  ];


  return (
    <div className="container section-padding animate-fade-in">
      {/* Header section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '20px' }}>
          <Sparkles size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Our Expertise
        </span>
        <h1 className="section-title">Capabilities & Solutions</h1>
        <p className="section-subtitle">
          We construct tailored digital systems using modern frameworks. Explore our core service capabilities below.
        </p>
      </div>

      {/* Services Grid (Responsive: 3 columns desktop, 2 tablet, 1 mobile via grid-3-col) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          Loading services catalog...
        </div>
      ) : services.length > 0 ? (
        <div className="grid-3-col" style={{ margin: '60px 0' }}>
          {services.map((service, index) => {
            const themeInfo = getServiceTheme(index);
            return (
              <div 
                key={service._id || service.id} 
                className={`service-page-card ${themeInfo.theme === 'purple' ? 'purple-theme' : ''}`}
              >
                {/* Custom Icon Squircle */}
                <div style={{
                  color: themeInfo.accentColor,
                  background: themeInfo.bgColor,
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '28px',
                  flexShrink: 0
                }}>
                  {getServiceIcon(service.icon)}
                </div>

                {/* Content */}
                <h2 style={{ 
                  fontSize: '1.35rem', 
                  marginBottom: '14px', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 700 
                }}>
                  {service.name}
                </h2>
                
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.92rem', 
                  lineHeight: '1.6',
                  marginBottom: '28px',
                  flex: 1 
                }}>
                  {service.description}
                </p>

                {/* Learn More Interactive link */}
                <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                  <Link 
                    to="/contact" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      color: themeInfo.accentColor, 
                      fontWeight: 600, 
                      fontSize: '0.9rem', 
                      textDecoration: 'none' 
                    }}
                  >
                    Learn More
                    <ArrowRight size={16} className="arrow-icon" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          No services listed in the catalog.
        </div>
      )}

      {/* FAQ Accordion Section */}
      <div className="faq-accordion-container">
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2rem', 
          marginBottom: '16px', 
          fontFamily: 'var(--font-display)' 
        }}>
          Frequently Asked Questions
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: 'var(--text-secondary)', 
          maxWidth: '600px', 
          margin: '0 auto 48px auto', 
          fontSize: '0.95rem' 
        }}>
          Find fast, direct answers to common questions about our engineering workflows and collaborative processes.
        </p>

        <div>
          {faqItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${openIndex === idx ? 'active' : ''}`}
            >
              <button
                className="faq-header"
                onClick={() => toggleFaq(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-panel-${idx}`}
                id={`faq-btn-${idx}`}
                type="button"
              >
                <span>{item.q}</span>
                <div className="faq-icon-wrapper">
                  <Plus size={20} />
                </div>
              </button>
              
              <div 
                id={`faq-panel-${idx}`}
                role="region"
                aria-labelledby={`faq-btn-${idx}`}
                className="faq-content"
              >
                <div className="faq-body">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Small Reassuring Footer CTA banner */}
      <div className="glass-card" style={{ 
        padding: '40px', 
        textAlign: 'center', 
        border: '1px solid rgba(6, 182, 212, 0.15)',
        marginTop: '80px'
      }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>
          Have a project parameter or research spec that doesn't fit standard categories?
        </p>
        <Link 
          to="/contact" 
          className="glow-btn" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
        >
          Consult Our Engineers
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Services;
