const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  requireAuth: async (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
      const user = await User.findOne({ email: payload.email });
      if (!user || user.isLocked) return res.status(401).json({ error: 'Unauthorized' });

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },
  requireRole: (role) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  }
};
