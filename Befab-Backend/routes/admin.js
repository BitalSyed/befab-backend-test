const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');

const User = require('../models/User');
const Newsletter = require('../models/Newsletter');
const Video = require('../models/Video');
// const Group = require('../models/Group');
const Competition = require('../models/Competition');
const Survey = require('../models/Survey');

// All admin routes require admin
router.use(requireAuth, requireRole('admin'));

/**
 * ADMIN: Dashboard snapshots (counts/analytics placeholders)
 * Matches spec: user counts, content stats, etc.
 */
router.get('/dashboard', async (req, res) => {
  const [totalUsers, admins, members, newsletters, videos, groups, competitions, surveys] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'member' }),
      Newsletter.countDocuments(),
      Video.countDocuments(),
      Group.countDocuments(),
      Competition.countDocuments(),
      Survey.countDocuments()
    ]);

  res.json({
    users: { total: totalUsers, admins, members },
    content: { newsletters, videos, groups, competitions, surveys }
  });
});

/**
 * USER MANAGEMENT (Admin)
 */
router.get('/users', async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

router.post('/users', async (req, res) => {
  const { firstName, lastName, username, email, passwordHash, role } = req.body;
  if (!firstName || !lastName || !username || !email || !passwordHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ error: 'User already exists' });

  const u = await User.create({ firstName, lastName, username, email, passwordHash, role: role || 'member' });
  res.status(201).json({ id: u._id });
});

router.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const update = (({ firstName, lastName, username, email, role, isActive, isLocked, avatarUrl }) => 
    ({ firstName, lastName, username, email, role, isActive, isLocked, avatarUrl }))(req.body);
  const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ ok: true });
});

/**
 * NEWSLETTERS (Admin creates/edits; statuses: draft/scheduled/published)
 * per spec: only admins post; users can read/comment/like/save. :contentReference[oaicite:23]{index=23}
 */
router.get('/newsletters', async (_req, res) => {
  const list = await Newsletter.find().populate('author', 'firstName lastName username role').sort({ createdAt: -1 });
  res.json(list);
});

router.post('/newsletters', async (req, res) => {
  const { title, description, picture, status, scheduledAt } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Missing title/description' });
  const doc = await Newsletter.create({
    title, description, picture, status: status || 'draft', scheduledAt, author: req.user._id
  });
  res.status(201).json(doc);
});

router.patch('/newsletters/:id', async (req, res) => {
  const doc = await Newsletter.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

router.delete('/newsletters/:id', async (req, res) => {
  await Newsletter.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/**
 * VIDEO MANAGEMENT (Admin moderate/approve/remove; analytics later)
 * Categories: BeFAB HBCU, Mentor Meetup, Students. :contentReference[oaicite:24]{index=24}
 */
router.get('/videos', async (_req, res) => {
  const vids = await Video.find().populate('uploader', 'username role').sort({ createdAt: -1 });
  res.json(vids);
});

router.patch('/videos/:id/moderate', async (req, res) => {
  const { status } = req.body; // pending/approved/rejected/published
  if (!['pending', 'approved', 'rejected', 'published'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const video = await Video.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!video) return res.status(404).json({ error: 'Not found' });
  res.json(video);
});

router.delete('/videos/:id', async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/**
 * GROUPS (Admin creates/edits; can toggle public/private) :contentReference[oaicite:25]{index=25}
 */
router.get('/groups', async (_req, res) => {
  const groups = await Group.find().sort({ createdAt: -1 });
  res.json(groups);
});

router.post('/groups', async (req, res) => {
  const { name, description, imageUrl, bannerUrl, visibility } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  const grp = await Group.create({ name, description, imageUrl, bannerUrl, visibility, createdBy: req.user._id });
  res.status(201).json(grp);
});

router.patch('/groups/:id', async (req, res) => {
  const grp = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!grp) return res.status(404).json({ error: 'Not found' });
  res.json(grp);
});

router.delete('/groups/:id', async (req, res) => {
  await Group.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/**
 * COMPETITIONS (Admin CRUD; AI-suggested omitted server-side; leaderboard endpoint) :contentReference[oaicite:26]{index=26}
 */
router.get('/competitions', async (_req, res) => {
  const comps = await Competition.find().sort({ createdAt: -1 });
  res.json(comps);
});

router.post('/competitions', async (req, res) => {
  const { title, description, imageUrl, start, end, status } = req.body;
  if (!title || !description || !start || !end) return res.status(400).json({ error: 'Missing fields' });
  if (new Date(end) <= new Date(start)) return res.status(400).json({ error: 'End must be after start' });
  const c = await Competition.create({
    title, description, imageUrl, start, end, status: status || 'upcoming', author: req.user._id
  });
  res.status(201).json(c);
});

router.patch('/competitions/:id', async (req, res) => {
  const c = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c);
});

router.delete('/competitions/:id', async (req, res) => {
  await Competition.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.get('/competitions/:id/leaderboard', async (req, res) => {
  const c = await Competition.findById(req.params.id).populate('leaderboard.user', 'username');
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c.leaderboard);
});

/**
 * SURVEYS (Admin creates; required/optional) :contentReference[oaicite:27]{index=27}
 */
router.get('/surveys', async (_req, res) => {
  const list = await Survey.find().sort({ createdAt: -1 });
  res.json(list);
});

router.post('/surveys', async (req, res) => {
  const { title, description, type, audience, dueDate, durationMin, questions } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });
  const survey = await Survey.create({
    title, description, type, audience, dueDate, durationMin, questions, createdBy: req.user._id
  });
  res.status(201).json(survey);
});

router.patch('/surveys/:id', async (req, res) => {
  const survey = await Survey.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!survey) return res.status(404).json({ error: 'Not found' });
  res.json(survey);
});

router.delete('/surveys/:id', async (req, res) => {
  await Survey.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
