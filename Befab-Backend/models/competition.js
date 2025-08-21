const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    status: { type: String, enum: ['draft', 'upcoming', 'active', 'completed', 'paused'], default: 'draft' }, // :contentReference[oaicite:9]{index=9}
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin only :contentReference[oaicite:10]{index=10}
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        progress: { type: Number, default: 0 }, // % progress
        score: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now }
      }
    ],
    leaderboard: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rank: Number,
        score: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Competition', CompetitionSchema);
