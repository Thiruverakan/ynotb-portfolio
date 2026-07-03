import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Eye, ExternalLink, Github } from 'lucide-react';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects;

  return (
    <div className="container section-padding animate-fade-in">
      <span className="badge badge-cyan" style={{ display: 'block', margin: '0 auto 16px auto', width: 'fit-content' }}>Case Studies</span>
      <h1 className="section-title">Our Previous Work</h1>
      <p className="section-subtitle">A collection of custom applications, API architectures, and design prototypes built by the YnotB team.</p>



      {/* Grid of Projects */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 340px))',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '40px'
        }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card" style={{ height: '320px' }}>Loading...</div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 340px))',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '20px'
        }}>
          {filteredProjects.map((project) => {
            return (
              <div key={project._id || project.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                {/* Card Image */}
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 3
                  }}>
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="icon-btn-hover" style={{
                        background: 'rgba(9, 13, 22, 0.85)',
                        color: 'var(--text-primary)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-color)'
                      }}>
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="icon-btn-hover" style={{
                        background: 'rgba(9, 13, 22, 0.85)',
                        color: 'var(--text-primary)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-color)'
                      }}>
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className={`badge ${project.category === 'Business' ? 'badge-cyan' : 'badge-purple'}`} style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
                      {project.category || 'University'}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                    {project.title}
                  </h2>
                </div>
              </div>
            );
          })}
      </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
          No projects matching the filter selection.
        </div>
      )}
      
      <style>{`
        .icon-btn-hover:hover {
          background: var(--accent-primary) !important;
          color: white !important;
          border-color: var(--accent-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
