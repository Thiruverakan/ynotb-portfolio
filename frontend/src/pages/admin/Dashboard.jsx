import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Users,
  Mail,
  UserCog,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  LogOut,
  UserCheck,
  ChevronRight,
  Star,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const { user, token, logout, isOwner, isAdmin, isEngineer } = useAuth();
  const navigate = useNavigate();

  // Active tab state: 'overview' | 'projects' | 'services' | 'team' | 'messages' | 'users' | 'feedbacks'
  const [activeTab, setActiveTab] = useState('overview');

  // Stats states
  const [stats, setStats] = useState({
    projectsCount: 0,
    servicesCount: 0,
    teamCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
    feedbacksCount: 0
  });

  // DB Data states
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  // UI loading/refreshing states
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'project' | 'service' | 'team' | 'user' | 'messageView'
  const [selectedItem, setSelectedItem] = useState(null); // for editing or viewing details

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'University',
    duration: '',
    price: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'Progress',
    dueDate: ''
  });
  const [serviceForm, setServiceForm] = useState({ name: '', icon: 'code', description: '', priceRange: '' });
  const [teamForm, setTeamForm] = useState({ name: '', role: '', bio: '', imageUrl: '', skills: '', github: '', linkedin: '', twitter: '' });
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', roleId: '', isActive: true });

  const loadData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch public info (doesn't strictly need headers, but good to fetch)
      const [projRes, servRes, teamRes, fbRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/services'),
        fetch('/api/team'),
        fetch('/api/feedbacks')
      ]);

      const projData = await projRes.json();
      const servData = await servRes.json();
      const teamData = await teamRes.json();
      const fbData = await fbRes.json();

      if (projData.success) setProjects(projData.projects);
      if (servData.success) setServices(servData.services);
      if (teamData.success) setTeam(teamData.team);
      if (fbData.success) setFeedbacks(fbData.feedbacks);

      // 2. Fetch authenticated messages (available to all roles)
      const msgRes = await fetch('/api/messages', { headers });
      const msgData = await msgRes.json();
      if (msgData.success) {
        setMessages(msgData.messages);
      }

      // 3. Fetch users & roles (Owner only)
      if (isOwner) {
        const usersRes = await fetch('/api/users', { headers });
        const rolesRes = await fetch('/api/users/roles', { headers });
        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();

        if (usersData.success) setUsersList(usersData.users);
        if (rolesData.success) setRolesList(rolesData.roles);
      }

      // 4. Update stats counts
      const unreadCount = msgData.success ? msgData.messages.filter(m => m.status === 'unread').length : 0;
      setStats({
        projectsCount: projData.success ? projData.projects.length : 0,
        servicesCount: servData.success ? servData.services.length : 0,
        teamCount: teamData.success ? teamData.team.length : 0,
        messagesCount: msgData.success ? msgData.messages.length : 0,
        unreadMessages: unreadCount,
        feedbacksCount: fbData.success ? fbData.feedbacks.length : 0
      });

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, isOwner]);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  // ==========================================
  // PROJECT CRUD ACTIONS
  // ==========================================
  const openProjectModal = (proj = null) => {
    if (proj) {
      setSelectedItem(proj);
      setProjectForm({
        title: proj.title,
        category: proj.category || 'University',
        duration: proj.duration || '',
        price: proj.price || '',
        clientName: proj.clientName || '',
        clientEmail: proj.clientEmail || '',
        clientPhone: proj.clientPhone || '',
        status: proj.status || 'Progress',
        dueDate: proj.dueDate ? new Date(proj.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setSelectedItem(null);
      setProjectForm({
        title: '',
        category: 'University',
        duration: '',
        price: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        status: 'Progress',
        dueDate: ''
      });
    }
    setModalType('project');
    setIsModalOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: projectForm.title,
      category: projectForm.category,
      duration: projectForm.duration,
      price: projectForm.price,
      clientName: projectForm.clientName,
      clientEmail: projectForm.clientEmail,
      clientPhone: projectForm.clientPhone,
      status: projectForm.status,
      dueDate: projectForm.dueDate || null
    };

    const method = selectedItem ? 'PUT' : 'POST';
    const url = selectedItem ? `/api/projects/${selectedItem._id || selectedItem.id}` : '/api/projects';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Confirm delete case study project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // SERVICE CRUD ACTIONS
  // ==========================================
  const openServiceModal = (serv = null) => {
    if (serv) {
      setSelectedItem(serv);
      setServiceForm({
        name: serv.name,
        icon: serv.icon,
        description: serv.description,
        priceRange: serv.priceRange || ''
      });
    } else {
      setSelectedItem(null);
      setServiceForm({ name: '', icon: 'code', description: '', priceRange: '' });
    }
    setModalType('service');
    setIsModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const method = selectedItem ? 'PUT' : 'POST';
    const url = selectedItem ? `/api/services/${selectedItem._id || selectedItem.id}` : '/api/services';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete service from catalog?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // TEAM CRUD ACTIONS
  // ==========================================
  const openTeamModal = (member = null) => {
    if (member) {
      setSelectedItem(member);
      setTeamForm({
        name: member.name,
        role: member.role,
        degree: member.degree || '',
        bio: member.bio,
        imageUrl: member.imageUrl || '',
        github: member.socialLinks?.github || '',
        linkedin: member.socialLinks?.linkedin || ''
      });
    } else {
      setSelectedItem(null);
      setTeamForm({
        name: '',
        role: '',
        degree: '',
        bio: '',
        imageUrl: '',
        github: '',
        linkedin: ''
      });
    }
    setModalType('team');
    setIsModalOpen(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    
    const normalizeSocialUrl = (url) => {
      if (!url) return '';
      let trimmed = url.trim();
      if (!trimmed) return '';
      if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    };

    const payload = {
      name: teamForm.name,
      role: teamForm.role,
      degree: teamForm.degree,
      bio: teamForm.bio,
      imageUrl: teamForm.imageUrl,
      socialLinks: {
        github: normalizeSocialUrl(teamForm.github),
        linkedin: normalizeSocialUrl(teamForm.linkedin)
      }
    };

    const method = selectedItem ? 'PUT' : 'POST';
    const url = selectedItem ? `/api/team/${selectedItem._id || selectedItem.id}` : '/api/team';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Remove team member listing?')) return;
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this client feedback review?')) return;
    try {
      const res = await fetch(`/api/feedbacks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.message || 'Failed to delete feedback');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // INQUIRY MESSAGE ACTIONS
  // ==========================================
  const viewMessage = async (msg) => {
    setSelectedItem(msg);
    setModalType('messageView');
    setIsModalOpen(true);

    // If message is unread, automatically mark as read on backend
    if (msg.status === 'unread' && isAdmin) {
      try {
        await fetch(`/api/messages/${msg._id || msg.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'read' })
        });
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMessageStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        if (selectedItem) {
          setSelectedItem(prev => ({ ...prev, status }));
        }
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this inquiry message permanently?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // USER & ROLE CRUD ACTIONS (Owner only)
  // ==========================================
  const openUserModal = (usr = null) => {
    if (usr) {
      setSelectedItem(usr);
      setUserForm({
        name: usr.name,
        username: usr.username,
        password: '', // blank by default during edit
        roleId: usr.role?._id || usr.role || '',
        isActive: usr.isActive
      });
    } else {
      setSelectedItem(null);
      setUserForm({ name: '', username: '', password: '', roleId: rolesList[0]?._id || '', isActive: true });
    }
    setModalType('user');
    setIsModalOpen(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const method = selectedItem ? 'PUT' : 'POST';
    const url = selectedItem ? `/api/users/${selectedItem._id || selectedItem.id}` : '/api/users';

    // If password is blank during edit, don't submit it
    const payload = { ...userForm };
    if (selectedItem && payload.password.trim() === '') {
      delete payload.password;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Permanently remove this user account?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex' }} className="admin-container animate-fade-in">
      {/* Sidebar navigation */}
      <aside style={{
        width: '260px',
        background: 'rgba(17, 24, 39, 0.7)',
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }} className="admin-sidebar">
        
        {/* User Badge Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{
            background: 'var(--accent-primary)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.name}</h4>
            <span className="badge" style={{ fontSize: '0.65rem', padding: '1px 6px', marginTop: '4px', display: 'inline-block' }}>{user?.role}</span>
          </div>
        </div>

        {/* Navigation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('projects')}
            className={`sidebar-btn ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <FolderKanban size={18} />
            Case Studies
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`sidebar-btn ${activeTab === 'team' ? 'active' : ''}`}
          >
            <Users size={18} />
            Engineering Team
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`sidebar-btn ${activeTab === 'messages' ? 'active' : ''}`}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} />
              Client Inquiries
            </span>
            {stats.unreadMessages > 0 && (
              <span style={{
                background: 'var(--accent-secondary)',
                color: '#090d16',
                borderRadius: '50%',
                fontSize: '0.75rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stats.unreadMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`sidebar-btn ${activeTab === 'feedbacks' ? 'active' : ''}`}
          >
            <MessageSquare size={18} />
            Client Feedback
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab('users')}
              className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            >
              <UserCog size={18} />
              User Accounts
            </button>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: '8px',
            fontSize: '0.95rem'
          }}
          className="sidebar-btn-logout"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main dashboard content area */}
      <main style={{ flex: 1, padding: '40px 32px', overflowY: 'auto' }}>
        
        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Refreshing dashboard console parameter metrics...</div>
        ) : (
          <>
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Console Overview</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Operational stats and quick visitor inquiries inbox overview.</p>

                {/* Metric Cards grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '24px',
                  marginBottom: '48px'
                }}>
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Portfolio Projects</span>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginTop: '8px' }}>{stats.projectsCount}</h2>
                  </div>
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client Feedbacks</span>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-secondary)', marginTop: '8px' }}>{stats.feedbacksCount}</h2>
                  </div>
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Core Engineers</span>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', marginTop: '8px' }}>{stats.teamCount}</h2>
                  </div>
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Inquiries</span>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginTop: '8px' }}>{stats.messagesCount}</h2>
                  </div>
                </div>

                {/* Recent inquiries */}
                <div className="glass-card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>Recent Inbox Inquiries</h3>
                  {messages.length > 0 ? (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Sender</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.slice(0, 5).map((msg) => (
                            <tr key={msg._id || msg.id}>
                              <td style={{ fontWeight: 600 }}>{msg.name}</td>
                              <td>{msg.subject}</td>
                              <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${msg.status === 'unread' ? 'badge-cyan' : ''}`} style={{
                                  fontSize: '0.65rem',
                                  padding: '2px 8px',
                                  background: msg.status === 'replied' ? 'rgba(16, 185, 129, 0.15)' : '',
                                  color: msg.status === 'replied' ? '#34d399' : '',
                                  border: msg.status === 'replied' ? '1px solid rgba(16, 185, 129, 0.3)' : ''
                                }}>
                                  {msg.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  onClick={() => viewMessage(msg)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--accent-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  <Eye size={14} />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No contact inquiries received yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Manage Case Studies</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or delete items displayed on the public Portfolio page.</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => openProjectModal()} className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Plus size={16} />
                      Add Project
                    </button>
                  )}
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  {projects.length > 0 ? (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Category</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Client Info</th>
                            <th>Status</th>
                            <th>Deadline / Overdue</th>
                            {isAdmin && <th>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((proj) => {
                            // Check if overdue
                            let isOverdue = false;
                            let overdueDays = 0;
                            if (proj.status === 'Progress' && proj.dueDate) {
                              const due = new Date(proj.dueDate);
                              const today = new Date();
                              due.setHours(0,0,0,0);
                              today.setHours(0,0,0,0);
                              if (today > due) {
                                isOverdue = true;
                                const diffTime = Math.abs(today - due);
                                overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              }
                            }

                            return (
                              <tr key={proj._id || proj.id}>
                                <td style={{ fontWeight: 600 }}>{proj.title}</td>
                                <td>
                                  <span className={`badge ${proj.category === 'Business' ? 'badge-cyan' : 'badge-purple'}`} style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                                    {proj.category || 'University'}
                                  </span>
                                </td>
                                <td>{proj.duration || 'N/A'}</td>
                                <td style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
                                  {proj.price ? (isNaN(proj.price.replace(/,/g, '')) ? `Rs. ${proj.price}` : `Rs. ${Number(proj.price.replace(/,/g, '')).toLocaleString()}`) : 'N/A'}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 500 }}>{proj.clientName || 'N/A'}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                      {proj.clientEmail} {proj.clientPhone ? `(${proj.clientPhone})` : ''}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge" style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    background: proj.status === 'Complete' ? 'rgba(16, 185, 129, 0.15)' : (proj.status === 'Omit' ? 'rgba(156, 163, 175, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                                    color: proj.status === 'Complete' ? '#34d399' : (proj.status === 'Omit' ? '#9ca3af' : '#fbbf24'),
                                    border: `1px solid ${proj.status === 'Complete' ? 'rgba(16, 185, 129, 0.3)' : (proj.status === 'Omit' ? 'rgba(156, 163, 175, 0.3)' : 'rgba(245, 158, 11, 0.3)')}`
                                  }}>
                                    {proj.status || 'Progress'}
                                  </span>
                                </td>
                                <td>
                                  {isOverdue ? (
                                    <span style={{ color: '#f87171', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      ⚠️ Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
                                    </span>
                                  ) : (
                                    proj.dueDate ? new Date(proj.dueDate).toLocaleDateString() : 'No deadline'
                                  )}
                                </td>
                                {isAdmin && (
                                  <td>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                      <button onClick={() => openProjectModal(proj)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }} title="Edit">
                                        <Edit2 size={16} />
                                      </button>
                                      <button onClick={() => handleDeleteProject(proj._id || proj.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Delete">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No projects available. Click 'Add Project' to create one.</p>
                  )}
                </div>
              </div>
            )}
            {/* TAB: TEAM */}
            {activeTab === 'team' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Manage Team Listings</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Configure software engineer profiles shown on the public Team page.</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => openTeamModal()} className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Plus size={16} />
                      Add Member
                    </button>
                  )}
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  {team.length > 0 ? (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Role Designation</th>
                            <th>Degree / Education</th>
                            <th>Bio</th>
                            {isAdmin && <th>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {team.map((member) => (
                            <tr key={member._id || member.id}>
                              <td style={{ fontWeight: 600 }}>{member.name}</td>
                              <td style={{ color: 'var(--accent-secondary)' }}>{member.role}</td>
                              <td style={{ color: 'var(--text-secondary)' }}>{member.degree || 'N/A'}</td>
                              <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.bio}</td>
                              {isAdmin && (
                                <td>
                                  <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => openTeamModal(member)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}>
                                      <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteTeam(member._id || member.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No team members available. Click 'Add Member' to create one.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: MESSAGES */}
            {activeTab === 'messages' && (
              <div>
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Client Inquiries Inbox</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Review project inquiries sent via the public contact forms.</p>

                <div className="glass-card" style={{ padding: '24px' }}>
                  {messages.length > 0 ? (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Sender</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Date Received</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.map((msg) => (
                            <tr key={msg._id || msg.id}>
                              <td style={{ fontWeight: 600 }}>{msg.name}</td>
                              <td>{msg.email}</td>
                              <td>{msg.subject}</td>
                              <td>{new Date(msg.createdAt).toLocaleString()}</td>
                              <td>
                                <span className={`badge ${msg.status === 'unread' ? 'badge-cyan' : ''}`} style={{
                                  fontSize: '0.65rem',
                                  padding: '2px 8px',
                                  background: msg.status === 'replied' ? 'rgba(16, 185, 129, 0.15)' : '',
                                  color: msg.status === 'replied' ? '#34d399' : '',
                                  border: msg.status === 'replied' ? '1px solid rgba(16, 185, 129, 0.3)' : ''
                                }}>
                                  {msg.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <button onClick={() => viewMessage(msg)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }} title="View details">
                                    <Eye size={16} />
                                  </button>
                                  {isAdmin && (
                                    <button onClick={() => handleDeleteMessage(msg._id || msg.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Delete permanenty">
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>Inbox is empty.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: FEEDBACKS */}
            {activeTab === 'feedbacks' && (
              <div>
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Client Feedback Management</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Review and manage feedback reviews submitted on the public website portal.</p>

                <div className="glass-card" style={{ padding: '24px' }}>
                  {feedbacks.length > 0 ? (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Sender Name</th>
                            <th>Country</th>
                            <th>Rating</th>
                            <th>Comment Summary</th>
                            <th>Date Received</th>
                            {isAdmin && <th>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {feedbacks.map((fb) => (
                            <tr key={fb._id || fb.id}>
                              <td style={{ fontWeight: 600 }}>{fb.name}</td>
                              <td>{fb.country}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={14} 
                                      color={fb.rating >= star ? '#eab308' : '#374151'} 
                                      fill={fb.rating >= star ? '#eab308' : 'none'} 
                                    />
                                  ))}
                                </div>
                              </td>
                              <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={fb.comment}>
                                {fb.comment}
                              </td>
                              <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                              {isAdmin && (
                                <td>
                                  <button 
                                    onClick={() => handleDeleteFeedback(fb._id || fb.id)} 
                                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                                    title="Delete Feedback"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No client feedback available.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: USERS (Owner only) */}
            {activeTab === 'users' && isOwner && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Manage Users & Roles</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Create system logins, assign roles, or deactivate team credentials.</p>
                  </div>
                  <button onClick={() => openUserModal()} className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} />
                    Create User
                  </button>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  {usersList.length > 0 ? (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.map((usr) => (
                            <tr key={usr._id || usr.id}>
                              <td style={{ fontWeight: 600 }}>{usr.name}</td>
                              <td>{usr.username}</td>
                              <td>
                                <span className="badge" style={{ fontSize: '0.7rem' }}>
                                  {usr.role?.name || usr.role || 'Software Engineer'}
                                </span>
                              </td>
                              <td>
                                <span style={{
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: usr.isActive ? '#34d399' : '#f87171'
                                }}>
                                  {usr.isActive ? 'Active' : 'Deactivated'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                  <button onClick={() => openUserModal(usr)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}>
                                    <Edit2 size={16} />
                                  </button>
                                  {(usr._id || usr.id) !== user.id && (
                                    <button onClick={() => handleDeleteUser(usr._id || usr.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No users found.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ==========================================
          DYNAMIC MODALS
          ========================================== */}
      {isModalOpen && (
        <div className="modal-overlay">
          
          {/* MODAL: PROJECT */}
          {modalType === 'project' && (
            <div className="glass-card modal-content" style={{ padding: '32px', maxWidth: '600px', width: '90%' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {selectedItem ? 'Edit Project Details' : 'Create Case Study Project'}
              </h2>
              <form onSubmit={handleProjectSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Project Name</label>
                    <input 
                      type="text" 
                      required 
                      value={projectForm.title} 
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} 
                      className="form-input" 
                      placeholder="e.g. Zenith Web App" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      value={projectForm.category} 
                      onChange={(e) => setProjectForm({...projectForm, category: e.target.value})} 
                      className="form-select"
                      style={{ background: 'rgba(9, 13, 22, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', width: '100%', height: '42px', padding: '0 12px' }}
                    >
                      <option value="University">University (Academic)</option>
                      <option value="Business">Business (Commercial)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input 
                      type="text" 
                      value={projectForm.duration} 
                      onChange={(e) => setProjectForm({...projectForm, duration: e.target.value})} 
                      className="form-input" 
                      placeholder="e.g. 3 Weeks, 2 Months" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (LKR)</label>
                    <input 
                      type="text" 
                      value={projectForm.price} 
                      onChange={(e) => setProjectForm({...projectForm, price: e.target.value})} 
                      className="form-input" 
                      placeholder="e.g. 150000" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input 
                    type="text" 
                    value={projectForm.clientName} 
                    onChange={(e) => setProjectForm({...projectForm, clientName: e.target.value})} 
                    className="form-input" 
                    placeholder="e.g. Dr. Arthur / Apex Corp" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Client Email</label>
                    <input 
                      type="email" 
                      value={projectForm.clientEmail} 
                      onChange={(e) => setProjectForm({...projectForm, clientEmail: e.target.value})} 
                      className="form-input" 
                      placeholder="e.g. client@example.com" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Phone</label>
                    <input 
                      type="text" 
                      value={projectForm.clientPhone} 
                      onChange={(e) => setProjectForm({...projectForm, clientPhone: e.target.value})} 
                      className="form-input" 
                      placeholder="e.g. +94 76 460 9326" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 1fr' : '1fr', gap: '16px' }}>
                  {selectedItem && (
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select 
                        value={projectForm.status} 
                        onChange={(e) => setProjectForm({...projectForm, status: e.target.value})} 
                        className="form-select"
                        style={{ background: 'rgba(9, 13, 22, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', width: '100%', height: '42px', padding: '0 12px' }}
                      >
                        <option value="Progress">Progress (In-Flight)</option>
                        <option value="Complete">Complete (Delivered)</option>
                        <option value="Omit">Omit (Cancelled/Dropped)</option>
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Deadline / Due Date</label>
                    <input 
                      type="date" 
                      value={projectForm.dueDate} 
                      onChange={(e) => setProjectForm({...projectForm, dueDate: e.target.value})} 
                      className="form-input" 
                      style={{ height: '42px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                  <button type="submit" className="glow-btn" style={{ flex: 1 }}>Save Project</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="glow-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* MODAL: SERVICE */}
          {modalType === 'service' && (
            <div className="glass-card modal-content" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                {selectedItem ? 'Edit Service' : 'Add Service'}
              </h2>
              <form onSubmit={handleServiceSubmit}>
                <div className="form-group">
                  <label className="form-label">Service Name</label>
                  <input type="text" required value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} className="form-input" placeholder="e.g. Mobile Development" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Icon ID</label>
                    <select value={serviceForm.icon} onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})} className="form-select">
                      <option value="code">code (Developer)</option>
                      <option value="mobile">mobile (Smartphones)</option>
                      <option value="server">server (Cloud & API)</option>
                      <option value="palette">palette (Design & UI)</option>
                      <option value="layers">layers (General)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cost Range</label>
                    <input type="text" required value={serviceForm.priceRange} onChange={(e) => setServiceForm({...serviceForm, priceRange: e.target.value})} className="form-input" placeholder="e.g. $5,000 - $10,000" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea required value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} className="form-textarea" placeholder="Detail standard deliverables..."></textarea>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button type="submit" className="glow-btn" style={{ flex: 1 }}>Save Service</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="glow-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* MODAL: TEAM MEMBER */}
          {modalType === 'team' && (
            <div className="glass-card modal-content" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                {selectedItem ? 'Edit Member Profile' : 'Add Team Member'}
              </h2>
              <form onSubmit={handleTeamSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" required value={teamForm.name} onChange={(e) => setTeamForm({...teamForm, name: e.target.value})} className="form-input" placeholder="Sarah Smith" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Designation</label>
                    <input type="text" required value={teamForm.role} onChange={(e) => setTeamForm({...teamForm, role: e.target.value})} className="form-input" placeholder="Senior UI/UX Designer" />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Browse Photo File (JPG, JPEG, PNG)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setTeamForm(prev => ({ ...prev, imageUrl: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="form-input" 
                    />
                    {teamForm.imageUrl && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img 
                            src={teamForm.imageUrl} 
                            alt="preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Card Preview (1:1 Ratio, headshot-aligned)</span>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree / Education</label>
                    <input 
                      type="text" 
                      required 
                      value={teamForm.degree} 
                      onChange={(e) => setTeamForm({...teamForm, degree: e.target.value})} 
                      className="form-input" 
                      placeholder="e.g. B.Sc. in Computer Science" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Link</label>
                    <input type="text" value={teamForm.github} onChange={(e) => setTeamForm({...teamForm, github: e.target.value})} className="form-input" placeholder="https://github.com/..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Link</label>
                    <input type="text" value={teamForm.linkedin} onChange={(e) => setTeamForm({...teamForm, linkedin: e.target.value})} className="form-input" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Bio Profile</label>
                  <textarea required value={teamForm.bio} onChange={(e) => setTeamForm({...teamForm, bio: e.target.value})} className="form-textarea" placeholder="Outline experience and engineering bio..."></textarea>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button type="submit" className="glow-btn" style={{ flex: 1 }}>Save Member</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="glow-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* MODAL: MESSAGE DETAIL VIEW */}
          {modalType === 'messageView' && selectedItem && (
            <div className="glass-card modal-content" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                Client Inquiry Details
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-primary)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>From:</span>
                  <span style={{ fontWeight: 600 }}>{selectedItem.name} ({selectedItem.email})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subject:</span>
                  <span style={{ fontWeight: 600 }}>{selectedItem.subject}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
                  <span>{new Date(selectedItem.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                  <span className="badge" style={{ width: 'fit-content' }}>{selectedItem.status}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Message Body:</span>
                  <div style={{
                    background: 'rgba(9, 13, 22, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}>
                    {selectedItem.message}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                {isAdmin && selectedItem.status !== 'replied' && (
                  <button onClick={() => handleMessageStatus(selectedItem._id || selectedItem.id, 'replied')} className="glow-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} />
                    Mark Replied
                  </button>
                )}
                {isAdmin && (
                  <button onClick={() => handleDeleteMessage(selectedItem._id || selectedItem.id)} className="glow-btn-secondary" style={{ flex: 1, color: '#f87171', borderColor: '#ef4444' }}>
                    Delete Message
                  </button>
                )}
                <button type="button" onClick={() => setIsModalOpen(false)} className="glow-btn-secondary" style={{ flex: 1 }}>Close</button>
              </div>
            </div>
          )}

          {/* MODAL: USER & ROLE MANAGEMENT (Owner only) */}
          {modalType === 'user' && isOwner && (
            <div className="glass-card modal-content" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                {selectedItem ? 'Edit User Credentials' : 'Create User Account'}
              </h2>
              <form onSubmit={handleUserSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" required value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} className="form-input" placeholder="Sarah Chen" />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" required value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} className="form-input" placeholder="Enter username" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    {selectedItem ? 'Update Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <input type="password" required={!selectedItem} value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} className="form-input" placeholder="••••••••" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Assign Role</label>
                    <select value={userForm.roleId} onChange={(e) => setUserForm({...userForm, roleId: e.target.value})} className="form-select">
                      {rolesList.map(r => (
                        <option key={r._id || r.id} value={r._id || r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Status</label>
                    <select value={userForm.isActive ? 'active' : 'inactive'} onChange={(e) => setUserForm({...userForm, isActive: e.target.value === 'active'})} className="form-select">
                      <option value="active">Active</option>
                      <option value="inactive">Deactivated</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button type="submit" className="glow-btn" style={{ flex: 1 }}>Save User</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="glow-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* Embedded CSS for sidebar buttons and styles */}
      <style>{`
        .sidebar-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }
        .sidebar-btn:hover, .sidebar-btn.active {
          background: rgba(124, 58, 237, 0.12);
          color: var(--text-primary);
        }
        .sidebar-btn.active {
          border-left: 3px solid var(--accent-primary);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        .sidebar-btn-logout:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #f87171 !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
