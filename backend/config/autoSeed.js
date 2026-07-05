const mongoose = require('mongoose');
const Role = require('../models/Role');
const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');
const TeamMember = require('../models/TeamMember');
const Message = require('../models/Message');
const mockDbStore = require('./mockDbStore');
const bcrypt = require('bcryptjs');

const rolesData = [
  { name: 'Owner', description: 'Full access to all system features including user and role management.' },
  { name: 'Admin', description: 'Can manage portfolio, services, team members, and client inquiries.' },
  { name: 'Software Engineer', description: 'Can view assigned dashboards and information.' }
];

const servicesData = [
  {
    name: 'Custom Web Applications',
    icon: 'code',
    description: 'End-to-end full-stack web application development tailored to your business processes. We build secure, interactive, and high-performance applications.',
    priceRange: '$5,000 - $25,000'
  },
  {
    name: 'Mobile App Development',
    icon: 'mobile',
    description: 'Cross-platform mobile applications for iOS and Android using React Native. Seamless native experiences with robust offline support.',
    priceRange: '$8,000 - $35,000'
  },
  {
    name: 'Cloud & DevOps Solutions',
    icon: 'server',
    description: 'Cloud architecture design, containerization (Docker, Kubernetes), CI/CD pipeline automation, and serverless deployments on AWS and Google Cloud.',
    priceRange: '$3,000 - $15,000'
  },
  {
    name: 'UI/UX Brand Design',
    icon: 'palette',
    description: 'Interactive wireframing, high-fidelity prototypes, user persona research, and responsive web design aligned with modern digital trends.',
    priceRange: '$2,000 - $8,000'
  }
];

const projectsData = [
  {
    title: 'Zenith e-Marketplace',
    description: 'A modern multi-vendor e-commerce platform built to support thousands of active concurrent users.',
    longDescription: 'Zenith e-Marketplace is a next-generation shopping platform. Features include real-time inventory management, a customizable seller portal, personalized product recommendations powered by a light ML model, integrated multi-currency Stripe checkout, and automated PDF invoice generation. The app utilizes Redis caching to deliver sub-100ms response times.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Stripe API'],
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2689',
    githubLink: 'https://github.com/ynotb-agency/zenith-market',
    liveLink: 'https://zenith-market.demo.ynotb.com',
    clientName: 'Zenith Retail Corp',
    duration: '4 Months'
  },
  {
    title: 'Nova Analytics Dashboard',
    description: 'Real-time financial analytics dashboard presenting key metrics and interactive charts for investment portfolios.',
    longDescription: 'Nova Analytics connects to multiple cryptocurrency and stock market APIs to aggregate asset data in real-time. It features interactive charts using Recharts, server-side data pagination, custom report exports in CSV/XLSX, role-based analyst access controls, and alert configurations sending instant SMS/Email notifications on market shifts.',
    technologies: ['React', 'Node.js', 'Mongoose', 'Chart.js', 'Recharts', 'Twilio API'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670',
    githubLink: 'https://github.com/ynotb-agency/nova-dashboard',
    liveLink: 'https://nova-dashboard.demo.ynotb.com',
    clientName: 'Nova Investments Ltd',
    duration: '3 Months'
  },
  {
    title: 'VitalPulse Care Portal',
    description: 'A HIPAA-compliant patient management and telehealth consultation platform for private practices.',
    longDescription: 'VitalPulse was commissioned to digitize clinical scheduling and host secure virtual consulting rooms. Built with absolute focus on data encryption at rest and in transit, the system includes WebRTC-powered video calling, automated email notifications for appointments, electronic health record (EHR) uploads, and seamless billing integration.',
    technologies: ['React', 'Express', 'MongoDB', 'WebRTC', 'Socket.io', 'AWS S3'],
    imageUrl: 'https://images.unsplash.com/photo-1504817342190-b8a91da7bb41?q=80&w=2670',
    githubLink: '',
    liveLink: 'https://vitalpulse.demo.ynotb.com',
    clientName: 'VitalPulse Healthcare Group',
    duration: '6 Months'
  }
];

const teamData = [
  {
    name: 'Alex Mercer',
    role: 'Founder & Technical Director',
    degree: 'M.Sc. in Software Engineering',
    bio: 'Over 10 years of experience building scalable systems. Former Staff Architect, specializing in microservices, cloud deployments, and software engineering leadership.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574',
    skills: ['Node.js', 'System Architecture', 'AWS', 'Docker', 'Kubernetes'],
    socialLinks: {
      github: 'https://github.com/alex-mercer-ynotb',
      linkedin: 'https://linkedin.com/in/alex-mercer',
      twitter: 'https://twitter.com/alexmercer'
    }
  },
  {
    name: 'Sarah Chen',
    role: 'Lead Full-Stack Engineer',
    degree: 'B.Sc. in Computer Science',
    bio: 'Passionate developer specializing in React and Node.js. Enjoys building clean user interfaces backed by performant and secure database systems.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574',
    skills: ['React', 'Express', 'MongoDB', 'TypeScript', 'GraphQL'],
    socialLinks: {
      github: 'https://github.com/sarah-chen-ynotb',
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: ''
    }
  },
  {
    name: 'Marcus Brody',
    role: 'UX Designer & Product Lead',
    degree: 'B.A. in Interaction Design',
    bio: 'Focuses on creating intuitive, aesthetic digital user flows. Marcus bridges the gap between client requirements and software engineering execution.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574',
    skills: ['Figma', 'Wireframing', 'User Research', 'HTML/CSS', 'Interactions Design'],
    socialLinks: {
      github: '',
      linkedin: 'https://linkedin.com/in/marcusbrody',
      twitter: 'https://twitter.com/marcusux'
    }
  }
];

const messagesData = [
  {
    name: 'Emily Watson',
    email: 'emily@watsonretail.com',
    subject: 'Inquiry: Inventory System Integration',
    message: 'Hello YnotB Team, we are looking to upgrade our current legacy inventory tracker. We would love to discuss custom API integrations with Shopify and Stripe. Please let me know your availability for a discovery call this week.',
    phone: '+447911123456',
    whatsappAvailable: true,
    status: 'unread'
  },
  {
    name: 'David K.',
    email: 'david@cryptonova.org',
    subject: 'Collaboration: Smart Contract Frontend',
    message: 'We saw your Nova Analytics Dashboard project and were highly impressed by the chart interfaces. We are looking for a team to build a similar analytics interface for our decentralized finance project. Let us connect.',
    phone: '+12025550143',
    whatsappAvailable: false,
    status: 'read'
  }
];

const autoSeed = async () => {
  if (global.useMockDb) {
    const roles = mockDbStore.find('roles');
    if (!roles || roles.length === 0) {
      console.log('Mock database empty. Seeding defaults...');
      
      const seededRoles = mockDbStore.insertMany('roles', rolesData);
      const ownerRole = seededRoles.find(r => r.name === 'Owner');
      const adminRole = seededRoles.find(r => r.name === 'Admin');
      const engineerRole = seededRoles.find(r => r.name === 'Software Engineer');

      const salt = await bcrypt.genSalt(10);
      const ownerPassword = await bcrypt.hash(process.env.DEFAULT_OWNER_PASSWORD || '2026', salt);
      const adminPassword = await bcrypt.hash('admin2026', salt);
      const engineerPassword = await bcrypt.hash('engineer2026', salt);

      mockDbStore.create('users', {
        name: 'YnotB Owner',
        username: process.env.DEFAULT_OWNER_USERNAME || 'Thiruverakan',
        password: ownerPassword,
        role: ownerRole._id,
        isActive: true
      });

      mockDbStore.create('users', {
        name: 'Demo Admin',
        username: 'admin',
        password: adminPassword,
        role: adminRole._id,
        isActive: true
      });

      mockDbStore.create('users', {
        name: 'Demo Engineer',
        username: 'engineer',
        password: engineerPassword,
        role: engineerRole._id,
        isActive: true
      });

      mockDbStore.insertMany('services', servicesData);
      mockDbStore.insertMany('projects', projectsData);
      mockDbStore.insertMany('teamMembers', teamData);
      mockDbStore.insertMany('messages', messagesData);
      console.log('Mock JSON database seeded successfully.');
    }
  } else {
    try {
      const roleCount = await Role.countDocuments();
      const userCount = await User.countDocuments();
      
      if (roleCount === 0 || userCount === 0) {
        console.log('MongoDB collections empty or missing users/roles. Auto-seeding defaults...');
        
        let dbRoles = await Role.find();
        if (dbRoles.length === 0) {
          dbRoles = await Role.insertMany(rolesData);
        }
        
        const ownerRole = dbRoles.find(r => r.name === 'Owner');
        const adminRole = dbRoles.find(r => r.name === 'Admin');
        const engineerRole = dbRoles.find(r => r.name === 'Software Engineer');

        const defaultOwnerUsername = process.env.DEFAULT_OWNER_USERNAME || 'Thiruverakan';
        const defaultOwnerPassword = process.env.DEFAULT_OWNER_PASSWORD || '2026';

        // Schema pre-save encrypts the password field for User.create
        await User.create({
          name: 'YnotB Owner',
          username: defaultOwnerUsername,
          password: defaultOwnerPassword,
          role: ownerRole._id,
          isActive: true
        });

        await User.create({
          name: 'Demo Admin',
          username: 'admin',
          password: 'admin2026',
          role: adminRole._id,
          isActive: true
        });

        await User.create({
          name: 'Demo Engineer',
          username: 'engineer',
          password: 'engineer2026',
          role: engineerRole._id,
          isActive: true
        });

        if ((await Service.countDocuments()) === 0) {
          await Service.insertMany(servicesData);
        }
        if ((await Project.countDocuments()) === 0) {
          await Project.insertMany(projectsData);
        }
        if ((await TeamMember.countDocuments()) === 0) {
          await TeamMember.insertMany(teamData);
        }
        if ((await Message.countDocuments()) === 0) {
          await Message.insertMany(messagesData);
        }
        console.log('MongoDB auto-seeding completed successfully.');
      }
    } catch (err) {
      console.error('Error during MongoDB auto-seeding:', err);
    }
  }
};

module.exports = autoSeed;
