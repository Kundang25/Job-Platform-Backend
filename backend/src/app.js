const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { errorMiddleware, notFound } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ---- security & parsing ----
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- logging ----
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ---- rate limiting ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// ---- health check ----
app.get('/', (req, res) => {
  res.json({ success: true, message: 'AutoApply AI backend is running' });
});

// ---- routes ----
app.use('/api/v1/auth', authRoutes);
// more modules get plugged in here as you build them:
// app.use('/api/v1/profile', profileRoutes);
// app.use('/api/v1/resume', resumeRoutes);
// app.use('/api/v1/jobs', jobRoutes);
// app.use('/api/v1/applications', applicationRoutes);

// ---- error handling (always last) ----
app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
