import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

import { ArrowLeft, ExternalLink, Github, Calendar, Briefcase, ChevronRight } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await fetch(apiUrl(`/api/projects/${id}`));
        const data = await res.json();
        if (data.success) {
          setProject(data.project);
        } else {
          // If project not found, go back
          navigate('/portfolio');
        }
      } catch (error) {
        console.error('Error fetching project detail:', error);
        navigate('/portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        color: 'var(--text-secondary)'
      }}>
        <div>Loading project specifications...</div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="container section-padding animate-fade-in">
      {/* Breadcrumb back */}
      <Link to="/portfolio" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        marginBottom: '32px'
      }} className="back-link">
        <ArrowLeft size={16} />
        Back to Case Studies
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '40px'
      }} className="project-detail-grid">
        {/* Main Banner Image */}
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          maxHeight: '450px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Text Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          marginTop: '20px'
        }}>
          {/* Left Column: Details */}
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontFamily: 'var(--font-display)',
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              {project.title}
            </h1>
            
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: '1.7',
              marginBottom: '32px',
              whiteSpace: 'pre-wrap'
            }}>
              {project.longDescription}
            </p>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Technologies Utilized</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.technologies.map((tech, index) => (
                <span key={index} className="badge badge-cyan" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar Spec Box */}
          <div>
            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>Project Parameters</h3>
              
              {project.clientName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: 'var(--accent-secondary)' }}><Briefcase size={20} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client</h4>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.clientName}</p>
                  </div>
                </div>
              )}

              {project.duration && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: 'var(--accent-primary)' }}><Calendar size={20} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timeline</h4>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.duration}</p>
                  </div>
                </div>
              )}

              {/* Links button box */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '12px'
              }}>
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="glow-btn" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.95rem'
                  }}>
                    Launch Live Site
                    <ExternalLink size={16} />
                  </a>
                )}

                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="glow-btn-secondary" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.95rem'
                  }}>
                    Browse Source
                    <Github size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .back-link:hover {
          color: var(--accent-secondary) !important;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
