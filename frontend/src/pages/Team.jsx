import React, { useState, useEffect } from 'react';
import { Github, Linkedin, X, GraduationCap, Briefcase, User } from 'lucide-react';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        if (data.success) {
          setTeam(data.team);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="container section-padding animate-fade-in">
      <span className="badge badge-cyan" style={{ display: 'block', margin: '0 auto 16px auto', width: 'fit-content' }}>Our Engineers</span>
      <h1 className="section-title">The Engineering Core</h1>
      <p className="section-subtitle">Meet the software architects, designers, and developers constructing the systems at YnotB.</p>

      {/* Grid of Team Members */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 340px))',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '60px'
        }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card" style={{ height: '360px' }}>Loading...</div>
          ))}
        </div>
      ) : team.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 340px))',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '60px'
        }}>
          {team.map((member) => (
            <div 
              key={member._id || member.id} 
              className="glass-card team-card-hover" 
              onClick={() => setSelectedMember(member)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Photo Box */}
              <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={member.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564'} 
                  alt={member.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s ease' }}
                  className="team-photo"
                />
              </div>

              {/* Info Box */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                  {member.name}
                </h2>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  {member.role}
                </h4>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0, flex: 1 }}>
                  {member.bio}
                </p>

                {/* Social links */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '16px',
                    display: 'flex',
                    gap: '16px',
                    marginTop: '6px'
                  }}
                >
                  {member.socialLinks?.github && (
                    <a 
                      href={member.socialLinks.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="team-social-btn" 
                      title="GitHub Profile" 
                      style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a 
                      href={member.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="team-social-btn" 
                      title="LinkedIn Profile" 
                      style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
          No team members listed.
        </div>
      )}

      {/* Detail Modal Popup overlay */}
      {selectedMember && (
        <div 
          onClick={() => setSelectedMember(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card" 
            style={{ 
              maxWidth: '550px', 
              width: '100%', 
              padding: '36px', 
              position: 'relative',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '20px'
            }}
          >
            {/* Close cross button */}
            <button 
              onClick={() => setSelectedMember(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '50%',
                color: 'var(--text-primary)',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              className="close-btn"
            >
              <X size={16} />
            </button>

            {/* Large avatar photo */}
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-secondary)', boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
              <img 
                src={selectedMember.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564'} 
                alt={selectedMember.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Profile info details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                {selectedMember.name}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <Briefcase size={12} />
                  {selectedMember.role}
                </span>
                {selectedMember.degree && (
                  <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-secondary)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <GraduationCap size={12} />
                    {selectedMember.degree}
                  </span>
                )}
              </div>
            </div>

            {/* Small bio details */}
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.92rem', 
              lineHeight: '1.7', 
              margin: '10px 0 0 0', 
              background: 'rgba(255,255,255,0.01)', 
              border: '1px solid rgba(255,255,255,0.03)', 
              borderRadius: '12px', 
              padding: '16px 20px',
              fontStyle: 'italic'
            }}>
              "{selectedMember.bio}"
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              {selectedMember.socialLinks?.github && (
                <a 
                  href={selectedMember.socialLinks.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="team-social-btn" 
                  title="GitHub Profile" 
                  style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              )}
              {selectedMember.socialLinks?.linkedin && (
                <a 
                  href={selectedMember.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="team-social-btn" 
                  title="LinkedIn Profile" 
                  style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {styleStyles}
    </div>
  );
};

const styleStyles = (
  <style>{`
    .team-card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -20px rgba(6, 182, 212, 0.25) !important;
      border-color: rgba(6, 182, 212, 0.3) !important;
    }
    .team-card-hover:hover .team-photo {
      transform: scale(1.08);
    }
    .team-social-btn:hover {
      color: var(--accent-secondary) !important;
      transform: scale(1.05);
    }
    .close-btn:hover {
      background: rgba(239, 68, 68, 0.15) !important;
      color: #f87171 !important;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `}</style>
);

export default Team;
