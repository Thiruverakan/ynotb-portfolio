require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Enforce HTTPS Redirection in Production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Middlewares
app.use(cors());
app.use(express.json());

const path = require('path');

// Client-side error logging route
app.post('/api/client-logs', (req, res) => {
  console.error('\n!!! BROWSER CLIENT-SIDE ERROR LOGGED !!!');
  console.error('Message:', req.body.message);
  console.error('Source:', req.body.source);
  console.error('Line:', req.body.line, 'Col:', req.body.col);
  console.error('Error Object:', req.body.error);
  console.error('Stack:', req.body.stack);
  console.error('======================================\n');
  res.json({ success: true });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/feedbacks', require('./routes/feedbackRoutes'));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'up', timestamp: new Date() });
});

// Wildcard fallback for React Router SPA history support
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware (fallback)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
