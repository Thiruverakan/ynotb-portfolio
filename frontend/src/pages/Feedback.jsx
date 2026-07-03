import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Globe, User, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    rating: 5,
    comment: ''
  });
  
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedbacks');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (ratingVal) => {
    setFormData({
      ...formData,
      rating: ratingVal
    });
  };

  const getRatingDescriptor = (ratingVal) => {
    switch (ratingVal) {
      case 5: return 'Excellent (5/5)';
      case 4: return 'Very Good (4/5)';
      case 3: return 'Good (3/5)';
      case 2: return 'Fair (2/5)';
      case 1: return 'Poor (1/5)';
      default: return 'Excellent (5/5)';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    setSubmitting(true);

    if (!formData.name || !formData.country || !formData.comment) {
      setFormError('Please fill in all details.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setFormSuccess(true);
        setFormData({
          name: '',
          country: '',
          rating: 5,
          comment: ''
        });
        // Prepended new feedback to state list for instant feedback
        setFeedbacks([data.data, ...feedbacks]);
      } else {
        setFormError(data.message || 'Submission failed.');
      }
    } catch (err) {
      setFormError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container section-padding animate-fade-in">
      {/* Header section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '20px' }}>
          <MessageSquare size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Client Reviews
        </span>
        <h1 className="section-title">What Our Clients & Students Say</h1>
        <p className="section-subtitle">
          Read direct assessments from students we've guided and businesses we've built systems for.
        </p>
      </div>

      {/* 1. Feedbacks list on TOP */}
      <div style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '24px', textAlign: 'center' }}>
          Latest Submissions
        </h2>

        {loading ? (
          <div className="grid-3-col">
            {[1, 2, 3].map((n) => (
              <div key={n} className="about-card" style={{ height: '140px' }}>Loading...</div>
            ))}
          </div>
        ) : feedbacks.length > 0 ? (
          <div className="grid-3-col">
            {feedbacks.map((item) => (
              <div 
                key={item._id || item.createdAt} 
                className="about-card" 
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {/* Header info (Stars + Date) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={16} 
                        color={item.rating >= star ? '#eab308' : '#374151'} 
                        fill={item.rating >= star ? '#eab308' : 'none'} 
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Comment review */}
                <p style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.5',
                  fontStyle: 'italic',
                  flex: 1
                }}>
                  "{item.comment}"
                </p>

                {/* Footer metadata (Author + Location) */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
                  paddingTop: '12px',
                  marginTop: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <User size={14} style={{ color: 'var(--accent-secondary)' }} />
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </div>
                  <span style={{ color: 'var(--border-color)', fontSize: '0.85rem' }}>|</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Globe size={14} />
                    <span>{item.country}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-muted)', 
            padding: '60px 40px', 
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            maxWidth: '650px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.005)'
          }}>
            <MessageSquare size={36} style={{ color: 'var(--accent-secondary)', marginBottom: '16px', opacity: 0.6 }} />
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>No Submissions Yet</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Be the first to submit your feedback using the form below!</p>
          </div>
        )}
      </div>

      {/* 2. Feedback Form UNDERneath - Premium Redesigned Card */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="about-card" style={{ 
          padding: '40px', 
          border: '1px solid rgba(6, 182, 212, 0.15)',
          background: 'rgba(9, 13, 22, 0.4)',
          boxShadow: '0 20px 40px -20px rgba(6, 182, 212, 0.12)'
        }}>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '10px', fontFamily: 'var(--font-display)', textAlign: 'center', fontWeight: 700 }}>
            Share Your Feedback
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'center' }}>
            We work hard to build robust software. Let us know how we did on your project or research session!
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {formSuccess && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                padding: '14px 18px',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.9rem'
              }}>
                <CheckCircle size={18} style={{ flexShrink: 0 }} />
                <span>Feedback submitted successfully! Thank you for supporting YnotB.</span>
              </div>
            )}

            {formError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '14px 18px',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.9rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            {/* Input 1: Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ paddingLeft: '48px', width: '100%', height: '46px', background: 'rgba(255, 255, 255, 0.015)' }}
                  placeholder="e.g., Emily Jenkins"
                  required
                />
              </div>
            </div>

            {/* Input 2: Country */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Country
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ paddingLeft: '48px', width: '100%', height: '46px', background: 'rgba(255, 255, 255, 0.015)' }}
                  placeholder="e.g., United Kingdom"
                  required
                />
              </div>
            </div>

            {/* Input 3: Star rating selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rating Assessment
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                background: 'rgba(255, 255, 255, 0.01)', 
                border: '1px solid rgba(255, 255, 255, 0.04)', 
                borderRadius: '10px', 
                padding: '12px 18px',
                width: 'fit-content'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        outline: 'none',
                        color: (hoverRating || formData.rating) >= star ? '#fbbf24' : '#374151',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="star-btn"
                    >
                      <Star size={26} fill={(hoverRating || formData.rating) >= star ? '#fbbf24' : 'none'} />
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, minWidth: '100px' }}>
                  {getRatingDescriptor(hoverRating || formData.rating)}
                </span>
              </div>
            </div>

            {/* Input 4: Comment */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Feedback (In a few words)
              </label>
              <div style={{ position: 'relative', display: 'flex' }}>
                <div style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }}>
                  <MessageSquare size={18} />
                </div>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="form-textarea"
                  style={{ paddingLeft: '48px', width: '100%', minHeight: '110px', background: 'rgba(255, 255, 255, 0.015)' }}
                  placeholder="Tell us what you liked about our collaboration..."
                  required
                ></textarea>
              </div>
            </div>

            {/* Disclaimer warning */}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0' }}>
              ⚠️ **Notice**: Submitting this review publishes it instantly on our website. To comply with security privacy regulations, reviews can only be altered or deleted by dashboard console administrators.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="glow-btn"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                height: '46px',
                marginTop: '6px'
              }}
            >
              <Send size={16} />
              {submitting ? 'Publishing...' : 'Publish Feedback Review'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Dynamic Star Button Hover scale */}
      <style>{`
        .star-btn:hover {
          transform: scale(1.18);
        }
      `}</style>
    </div>
  );
};

export default Feedback;
