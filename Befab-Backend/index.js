require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const appRoutes = require('./routes/app');
const adminRoutes = require('./routes/admin');
// NOTE: your existing routes/authenticate.js should export an Express router
const authRoutes = require('./routes/authenticate');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Public auth routes
app.use('/auth', authRoutes);

// Protected routes (middleware is applied inside each router)
app.use('/app', appRoutes);
app.use('/admin', adminRoutes);

// DB + Server
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/befab';

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
