const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

const Newsletter = require('../models/Newsletter');
const Video = require('../models/Video');
const Group = require('../models/Group');
const Competition = require('../models/Competition');
const Goal = require('../models/Goal');
const DayNutrition = require('../models/Nutrition');
const Fitness = require('../models/Fitness');
const { Chat, Message } = require('../models/Message');

// All app (user-facing) routes require auth
router.use(requireAuth);

/**
 * HOME content feed selections & notifications will be client-driven.
 * Below are concrete feature endpoints.
 */

/** NEWSLETTERS (read/list, like, comment, save) */
router.get('/newsletters', async (_req, res) => {
  const list = await Newsletter.find({ status: 'published' }).sort({ createdAt: -1 });
  res.json(list);
});

router.post('/newsletters/:id/like', async (req, res) => {
  const nl = await Newsletter.findById(req.params.id);
  if (!nl) return res.status(404).json({ error: 'Not found' });
  const idx = nl.likes.findIndex(u => u.toString() === req.user._id.toString());
  if (idx >= 0) nl.likes.splice(idx, 1); else nl.likes.push(req.user._id);
  await nl.save();
  res.json({ likes: nl.likes.length });
});

router.post('/newsletters/:id/comments', async (req, res) => {
  const { content, parent } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });
  const nl = await Newsletter.findById(req.params.id);
  if (!nl) return res.status(404).json({ error: 'Not found' });
  nl.comments.push({ author: req.user._id, content, parent: parent || null });
  await nl.save();
  res.status(201).json(nl.comments[nl.comments.length - 1]);
});

router.post('/newsletters/:id/save', async (req, res) => {
  const nl = await Newsletter.findById(req.params.id);
  if (!nl) return res.status(404).json({ error: 'Not found' });
  const idx = nl.savedBy.findIndex(u => u.toString() === req.user._id.toString());
  if (idx >= 0) nl.savedBy.splice(idx, 1); else nl.savedBy.push(req.user._id);
  await nl.save();
  res.json({ saved: idx < 0 });
});

/** VIDEOS (grid feed, post by users to Students tab; admin-only for other tabs) */
router.get('/videos', async (req, res) => {
  const { category } = req.query;
  const filter = { status: 'published' };
  if (category) filter.category = category;
  const vids = await Video.find(filter).sort({ createdAt: -1 });
  res.json(vids);
});

router.post('/videos', async (req, res) => {
  const { title, caption, category, url, thumbnailUrl, durationSec } = req.body;
  if (!title || !category || !url) return res.status(400).json({ error: 'Missing fields' });

  // Users can upload only to Students; admins may upload to any (client should enforce; server enforces here)
  const isStudents = category === 'Students';
  if (!isStudents && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can post to this category' });
  }

  const v = await Video.create({
    uploader: req.user._id, title, caption, category, url, thumbnailUrl, durationSec,
    status: req.user.role === 'admin' ? 'published' : 'pending'
  });
  res.status(201).json(v);
});

router.post('/videos/:id/like', async (req, res) => {
  const v = await Video.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  const idx = v.likes.findIndex(u => u.toString() === req.user._id.toString());
  if (idx >= 0) v.likes.splice(idx, 1); else v.likes.push(req.user._id);
  await v.save();
  res.json({ likes: v.likes.length });
});

router.post('/videos/:id/comments', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });
  const v = await Video.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  v.comments.push({ author: req.user._id, content });
  await v.save();
  res.status(201).json(v.comments[v.comments.length - 1]);
});

/** GROUPS (join, leave, request to join if private; posts/threads & comments) */
router.get('/groups', async (_req, res) => {
  const groups = await Group.find().select('name description imageUrl bannerUrl visibility members');
  res.json(groups);
});

router.post('/groups/:id/join', async (req, res) => {
  const g = await Group.findById(req.params.id);
  if (!g) return res.status(404).json({ error: 'Not found' });

  const alreadyMember = g.members.some(m => m.toString() === req.user._id.toString());
  if (alreadyMember) return res.json({ joined: true });

  if (g.visibility === 'private') {
    if (!g.joinRequests.some(r => r.toString() === req.user._id.toString())) g.joinRequests.push(req.user._id);
    await g.save();
    return res.json({ requested: true }); // admin must approve per spec :contentReference[oaicite:28]{index=28}
  } else {
    g.members.push(req.user._id);
    await g.save();
    return res.json({ joined: true });
  }
});

router.post('/groups/:id/leave', async (req, res) => {
  const g = await Group.findById(req.params.id);
  if (!g) return res.status(404).json({ error: 'Not found' });
  g.members = g.members.filter(m => m.toString() !== req.user._id.toString());
  await g.save();
  res.json({ joined: false });
});

router.post('/groups/:id/posts', async (req, res) => {
  const { content, images } = req.body;
  const g = await Group.findById(req.params.id);
  if (!g) return res.status(404).json({ error: 'Not found' });
  const isMember = g.members.some(m => m.toString() === req.user._id.toString());
  if (!isMember) return res.status(403).json({ error: 'Join the group first' });
  g.posts.push({ author: req.user._id, content, images });
  await g.save();
  res.status(201).json(g.posts[g.posts.length - 1]);
});

/** COMPETITIONS (list, join/leave, my progress, leaderboard) */
router.get('/competitions', async (_req, res) => {
  const now = new Date();
  const list = await Competition.find({ end: { $gte: new Date(now.getFullYear() - 1, 0, 1) } }).sort({ start: -1 });
  res.json(list);
});

router.post('/competitions/:id/join', async (req, res) => {
  const c = await Competition.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  const exists = c.participants.find(p => p.user.toString() === req.user._id.toString());
  if (exists) return res.json({ joined: true });
  c.participants.push({ user: req.user._id, progress: 0, score: 0 });
  await c.save();
  res.json({ joined: true });
});

router.get('/competitions/:id/leaderboard', async (req, res) => {
  const c = await Competition.findById(req.params.id).populate('leaderboard.user', 'username');
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c.leaderboard);
});

/** GOALS (create, list, update progress) */
router.get('/goals', async (req, res) => {
  const list = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
});

router.post('/goals', async (req, res) => {
  const { name, durationDays, milestones, trackProgress } = req.body;
  if (!name || !durationDays) return res.status(400).json({ error: 'Missing required fields' });
  const goal = await Goal.create({ user: req.user._id, name, durationDays, milestones, trackProgress });
  res.status(201).json(goal);
});

router.patch('/goals/:id/progress', async (req, res) => {
  const { progressValue, progressPercent, status } = req.body;
  const g = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { progressValue, progressPercent, status },
    { new: true }
  );
  if (!g) return res.status(404).json({ error: 'Not found' });
  res.json(g);
});

/** NUTRITION (meal logging, hydration tracker) */
router.get('/nutrition/:date', async (req, res) => {
  const date = new Date(req.params.date);
  const doc = await DayNutrition.findOne({ user: req.user._id, date });
  res.json(doc || { user: req.user._id, date, meals: { breakfast: [], lunch: [], dinner: [], snacks: [] }, waterIntake_oz: 0 });
});

router.post('/nutrition/:date/meal', async (req, res) => {
  const { bucket, item } = req.body; // bucket in [breakfast|lunch|dinner|snacks]
  if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(bucket)) return res.status(400).json({ error: 'Invalid bucket' });
  const date = new Date(req.params.date);
  const doc = await DayNutrition.findOneAndUpdate(
    { user: req.user._id, date },
    { $push: { [`meals.${bucket}`]: item } },
    { upsert: true, new: true }
  );
  res.status(201).json(doc);
});

router.post('/nutrition/:date/hydration', async (req, res) => {
  const { delta_oz } = req.body; // positive or negative oz
  const date = new Date(req.params.date);
  const doc = await DayNutrition.findOneAndUpdate(
    { user: req.user._id, date },
    { $inc: { waterIntake_oz: delta_oz } },
    { upsert: true, new: true }
  );
  res.json({ waterIntake_oz: doc.waterIntake_oz });
});

/** FITNESS (summary/vitals/workouts; manual add) */
router.get('/fitness/:date', async (req, res) => {
  const date = new Date(req.params.date);
  const f = await Fitness.findOne({ user: req.user._id, date });
  res.json(f || null);
});

router.post('/fitness/:date/workouts', async (req, res) => {
  const date = new Date(req.params.date);
  const { type, duration_min, distance_mi, calories_kcal, notes } = req.body;
  const f = await Fitness.findOneAndUpdate(
    { user: req.user._id, date },
    { $push: { workouts: { type, duration_min, distance_mi, calories_kcal, notes } } },
    { upsert: true, new: true }
  );
  res.status(201).json(f);
});

/** MESSAGES (chats with text/image/video) */
router.get('/chats', async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id }).sort({ updatedAt: -1 });
  res.json(chats);
});

router.post('/chats', async (req, res) => {
  const { participantIds } = req.body;
  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    return res.status(400).json({ error: 'participantIds required' });
  }
  const chat = await Chat.create({ participants: [req.user._id, ...participantIds] });
  res.status(201).json(chat);
});

router.get('/chats/:id/messages', async (req, res) => {
  const msgs = await Message.find({ chatId: req.params.id }).sort({ createdAt: 1 });
  res.json(msgs);
});

router.post('/chats/:id/messages', async (req, res) => {
  const { content, mediaUrl, mediaType } = req.body;
  const msg = await Message.create({ chatId: req.params.id, sender: req.user._id, content, mediaUrl, mediaType: mediaType || 'none' });
  await Chat.findByIdAndUpdate(req.params.id, { lastMessageAt: new Date() });
  res.status(201).json(msg);
});

/** SURVEYS (list & respond; tabs: required/optional/past are client filters) */
router.get('/surveys', async (_req, res) => {
  const list = await require('../models/Survey').find().sort({ createdAt: -1 });
  res.json(list);
});

router.post('/surveys/:id/response', async (req, res) => {
  const Survey = require('../models/Survey');
  const { answers } = req.body;
  const s = await Survey.findById(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  s.responses.push({ user: req.user._id, answers });
  await s.save();
  res.status(201).json({ ok: true });
});

module.exports = router;
