import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Compass, 
  GraduationCap, 
  Rocket, 
  Building, 
  Building2, 
  Code2, 
  Layers, 
  Shield, 
  Users, 
  HeartHandshake, 
  Sparkles, 
  Zap, 
  Award,
  UserCheck,
  FileText,
  MessageSquare,
  Lock,
  Gauge,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const targetAudience = [
    {
      icon: <GraduationCap size={24} />,
      title: 'University Teams & Students',
      description: 'We help student researchers, pilot programs, and academic spin-offs translate experimental concepts and models into functional software prototypes.'
    },
    {
      icon: <Rocket size={24} />,
      title: 'High-Growth Startups',
      description: 'We serve as your dedicated engineering arm, helping you architect, launch, and rapidly iterate on your MVP to hit product-market fit fast.'
    },
    {
      icon: <Building size={24} />,
      title: 'Small & Medium Businesses',
      description: 'We automate legacy workflows, construct custom tools, and integrate APIs to scale your operations, reduce overhead, and increase productivity.'
    },
    {
      icon: <Building2 size={24} />,
      title: 'Enterprise Corporations',
      description: 'We deliver HIPAA-compliant dashboards, secure database refactoring, and enterprise integrations built for peak load, compliance, and multi-tenant security.'
    }
  ];

  const coreValues = [
    {
      icon: <Code2 size={24} />,
      title: 'Technical Excellence',
      description: 'We write clean, strictly-typed, and maintainable code. No shortcuts, no hacky patches—only standard-compliant engineering.'
    },
    {
      icon: <Layers size={24} />,
      title: 'Scalable Architecture',
      description: 'Every database schema, API gateway, and server configuration we build is designed to scale horizontally to support thousands of active users.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Security & Privacy',
      description: 'We follow encryption-first policies (SSL/TLS, JWT, hashed credentials) to keep database collections secure, compliant, and protected.'
    },
    {
      icon: <Users size={24} />,
      title: 'Collaborative Development',
      description: 'We act as an integrated extension of your product team, keeping you aligned via clean sprints, git logs, and direct weekly updates.'
    },
    {
      icon: <HeartHandshake size={24} />,
      title: 'Client-Centered Solutions',
      description: 'We do not build technology for the sake of it. We design custom solutions structured specifically to solve your exact business constraints.'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Innovation First',
      description: 'We keep our skills synchronized with the latest developments in AI integrations, reactive state systems, and cloud-native frameworks.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Reliable Delivery',
      description: 'We honor our sprint schedules and scope agreements. We ship operational code on time and according to specifications.'
    },
    {
      icon: <Award size={24} />,
      title: 'Long-Term Partnership',
      description: 'We support your application long after launch, offering secure Service Level Agreements (SLAs) for server patches, extensions, and hosting.'
    }
  ];



  const whyChooseUs = [
    {
      icon: <UserCheck size={24} />,
      title: 'Senior-Led Engineering',
      description: 'No junior developer outsourcing. Your codebase is personally architected and coded by experienced senior full-stack developers.'
    },
    {
      icon: <FileText size={24} />,
      title: 'Fixed-Scope Contracts',
      description: 'No surprise bills or rolling hourly fees. We quote fixed-scope, fixed-price specifications so you know exactly what you pay for.'
    },
    {
      icon: <MessageSquare size={24} />,
      title: 'Direct Communication',
      description: 'You communicate directly with the developers writing your code. Zero account manager filters mean absolute clarity and zero overhead.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Rapid Prototypes',
      description: 'We move fast. We translate specs into functional prototypes in weeks, allowing you to test concepts, show users, or pitch investors.'
    },
    {
      icon: <Lock size={24} />,
      title: 'Compliance & Standards',
      description: 'We code to strict guidelines. We ensure database schemas and API requests are secure, following HIPAA, GDPR, and PCI recommendations.'
    },
    {
      icon: <Gauge size={24} />,
      title: 'Peak Performance Focus',
      description: 'We optimize for speed. Our code achieves excellent loading times, smooth CSS animations, lightweight page weights, and high search scores.'
    }
  ];

  return (
    <div className="container section-padding animate-fade-in">
      {/* 1. Hero Introduction */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '20px' }}>
          <Sparkles size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Who We Are
        </span>
        <h1 className="section-title" style={{ maxWidth: '800px', margin: '0 auto 20px auto' }}>
          Constructing Premium Software Solutions For Modern Teams
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
          YnotB Portfolio is a specialized software service team. We build robust databases, responsive client-facing web portals, cross-platform mobile apps, and custom cloud integrations engineered to scale.
        </p>
      </div>

      {/* 2. Mission & 3. Vision Section */}
      <div className="about-two-col" style={{ marginBottom: '80px' }}>
        <div className="about-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: 'var(--accent-secondary-glow)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            zIndex: 0
          }}></div>
          <div style={{
            color: 'var(--accent-secondary)',
            background: 'rgba(6, 182, 212, 0.1)',
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 1
          }}>
            <Target size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', fontFamily: 'var(--font-display)', position: 'relative', zIndex: 1 }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', position: 'relative', zIndex: 1 }}>
            To bridge the gap between complex software architecture and intuitive user experiences. We are dedicated to providing startups, local SMBs, and enterprise partners with clean code, secure data storage, and fixed-scope execution that eliminates technical debt from day one.
          </p>
        </div>

        <div className="about-card purple-theme" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: 'var(--accent-primary-glow)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            zIndex: 0
          }}></div>
          <div style={{
            color: 'var(--accent-primary)',
            background: 'rgba(124, 58, 237, 0.1)',
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 1
          }}>
            <Compass size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', fontFamily: 'var(--font-display)', position: 'relative', zIndex: 1 }}>Our Vision</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', position: 'relative', zIndex: 1 }}>
            To build a world-class software studio recognized for high-end engineering, transparent project management, and long-term client partnerships. We strive to empower businesses globally with robust technical foundations that adapt to changing markets and scale with growth.
          </p>
        </div>
      </div>

      {/* 4. Who We Work With */}
      <div style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Who We Work With</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 48px auto', fontSize: '0.95rem' }}>
          We design and build customized solutions tailored to the specific scales and budgets of diverse client teams.
        </p>
        <div className="grid-4-col">
          {targetAudience.map((audience, idx) => (
            <div key={idx} className="about-card" style={{ padding: '28px' }}>
              <div style={{
                color: 'var(--accent-secondary)',
                background: 'rgba(6, 182, 212, 0.08)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {audience.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>{audience.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{audience.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Our Core Values */}
      <div style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Our Core Values</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 48px auto', fontSize: '0.95rem' }}>
          These are the engineering and operating principles we follow on every project we code and deploy.
        </p>
        <div className="grid-4-col">
          {coreValues.map((value, idx) => (
            <div key={idx} className="about-card purple-theme" style={{ padding: '28px' }}>
              <div style={{
                color: 'var(--accent-primary)',
                background: 'rgba(124, 58, 237, 0.08)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {value.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>{value.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>



      {/* 7. Why Choose Us */}
      <div style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Why Choose Us</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 48px auto', fontSize: '0.95rem' }}>
          We configure clear operational contracts and write performant code so you can focus on building your business.
        </p>
        <div className="grid-3-col">
          {whyChooseUs.map((item, idx) => (
            <div key={idx} className="about-card purple-theme" style={{ padding: '32px' }}>
              <div style={{
                color: 'var(--accent-primary)',
                background: 'rgba(124, 58, 237, 0.08)',
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Call-To-Action (CTA) */}
      <div className="glass-card" style={{ 
        padding: '50px', 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid rgba(6, 182, 212, 0.2)'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '250px',
          height: '250px',
          background: 'var(--accent-secondary-glow)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
            Let's Construct Your Software Project Together
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
            Ready to convert your database requirements, web portals, or custom dashboard specifications into clean code? Let's connect.
          </p>
          <Link to="/contact" className="glow-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Start Project Discovery
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
