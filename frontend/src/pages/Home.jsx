import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../config';

import { ArrowRight, Code, Shield, Smartphone, Server, Palette, Layers, Award, Briefcase, Clock, Activity, Users, Code2, Brain } from 'lucide-react';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, servRes] = await Promise.all([
          fetch(apiUrl('/api/projects')),
          fetch(apiUrl('/api/services'))
        ]);
        
        const projData = await projRes.json();
        const servData = await servRes.json();

        if (projData.success) {
          // Take first 3 projects
          setFeaturedProjects(projData.projects.slice(0, 3));
        }
        if (servData.success) {
          // Take first 3 services
          setFeaturedServices(servData.services.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getServiceIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'code': return <Code size={36} />;
      case 'mobile': return <Smartphone size={36} />;
      case 'server': return <Server size={36} />;
      case 'palette': return <Palette size={36} />;
      default: return <Layers size={36} />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '120px 0 100px 0',
        background: 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 45%), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.08), transparent 45%)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          <span className="badge badge-cyan" style={{ marginBottom: '20px' }}>⚡ Software Agency & Creative Studio</span>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            lineHeight: '1.1',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Constructing Scalable Software For Modern Enterprises
          </h1>
          
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            maxWidth: '650px',
            margin: '0 auto 40px auto',
            lineHeight: '1.7'
          }}>
            We design, develop, and deploy custom full-stack web applications, secure mobile interfaces, and robust cloud configurations that drive results.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Link to="/contact" className="glow-btn">
              Discuss Your Project
            </Link>
            <Link to="/portfolio" className="glow-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              View Our Work
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section with Premium Dashboard Cards */}
      <section className="section-padding" style={{ 
        background: 'rgba(10, 15, 30, 0.5)', 
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div className="home-stats-grid">
            {/* Stat 1: Projects Completed */}
            <div className="stat-card">
              <div className="stat-card-icon" style={{
                color: 'var(--accent-secondary)',
                background: 'rgba(6, 182, 212, 0.08)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Briefcase size={22} />
              </div>
              <h3 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>5+</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Projects Completed</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Academic & Business Solutions</p>
            </div>

            {/* Stat 2: Response Time */}
            <div className="stat-card purple-theme">
              <div className="stat-card-icon" style={{
                color: 'var(--accent-primary)',
                background: 'rgba(124, 58, 237, 0.08)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={22} />
              </div>
              <h3 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>&lt; 24 Hours</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Average Response Time</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Replies to New Inquiries</p>
            </div>

            {/* Stat 3: Core Services */}
            <div className="stat-card">
              <div className="stat-card-icon" style={{
                color: 'var(--accent-secondary)',
                background: 'rgba(6, 182, 212, 0.08)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>6+</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Core Services</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Software, AI, Cloud, Design & Marketing</p>
            </div>

            {/* Stat 4: Who We Serve */}
            <div className="stat-card purple-theme">
              <div className="stat-card-icon" style={{
                color: 'var(--accent-primary)',
                background: 'rgba(124, 58, 237, 0.08)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={22} />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                color: '#ffffff', 
                fontWeight: 800, 
                marginBottom: '10px', 
                marginTop: '4px',
                letterSpacing: '-0.2px',
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                Students & Businesses
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Who We Serve</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Supporting Academic & Commercial Success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <span className="badge" style={{ display: 'block', margin: '0 auto 16px auto', width: 'fit-content' }}>Services</span>
          <h2 className="section-title">What We Do Best</h2>
          <p className="section-subtitle">A preview of our engineering services catalog tailored for university teams, SMEs, and digital startups.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {/* Card 1: Software & Web Development */}
            <div className="service-page-card">
              <div style={{
                color: 'var(--accent-secondary)',
                background: 'rgba(6, 182, 212, 0.08)',
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                flexShrink: 0
              }}>
                <Code2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                Software & Web Development
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '0', flex: 1 }}>
                Build modern websites, web applications, business systems, management platforms, e-commerce solutions, and custom software tailored to your requirements.
              </p>
            </div>

            {/* Card 2: AI Solutions */}
            <div className="service-page-card purple-theme">
              <div style={{
                color: 'var(--accent-primary)',
                background: 'rgba(124, 58, 237, 0.08)',
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                flexShrink: 0
              }}>
                <Brain size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                AI Solutions
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '0', flex: 1 }}>
                Develop intelligent applications using Artificial Intelligence, Machine Learning, automation, data analytics, chatbots, and predictive systems.
              </p>
            </div>

            {/* Card 3: Cloud Solutions */}
            <div className="service-page-card">
              <div style={{
                color: 'var(--accent-secondary)',
                background: 'rgba(6, 182, 212, 0.08)',
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                flexShrink: 0
              }}>
                <Server size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                Cloud Solutions
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '0', flex: 1 }}>
                Deploy, scale, and manage secure cloud infrastructure, APIs, databases, backups, and modern DevOps workflows.
              </p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/services" style={{ color: 'var(--accent-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Explore Full Catalog
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding" style={{ background: 'rgba(17, 24, 39, 0.2)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="badge badge-cyan" style={{ display: 'block', margin: '0 auto 16px auto', width: 'fit-content' }}>Portfolio</span>
          <h2 className="section-title">Featured Solutions</h2>
          <p className="section-subtitle">Explore a selection of clean, robust products designed and built by our team.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 340px))',
            justifyContent: 'center',
            gap: '32px'
          }}>
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="glass-card" style={{ height: '280px' }}>Loading...</div>
              ))
            ) : featuredProjects.length > 0 ? (
              featuredProjects.map((project) => {
                return (
                  <div key={project._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-normal)' }}
                        className="project-image-hover"
                      />
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className={`badge ${project.category === 'Business' ? 'badge-cyan' : 'badge-purple'}`} style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
                          {project.category || 'University'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                        {project.title}
                      </h3>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                No projects found. Log in to the console to add projects.
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/portfolio" className="glow-btn-secondary">
              Browse All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section-padding" style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Ready to construct your application?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 32px auto', fontSize: '1.05rem' }}>
            Submit an inquiry through our secure contact portal. Our engineers will analyze your parameters and draft a technical solution.
          </p>
          <Link to="/contact" className="glow-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Get in touch
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      
      <style>{`
        .project-image-hover:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Home;
