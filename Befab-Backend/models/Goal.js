const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true }, // health/fitness related :contentReference[oaicite:11]{index=11}
    durationDays: { type: Number, required: true, min: 1 },
    milestones: [
      {
        label: { type: String, required: true },
        targetValue: { type: Number, required: true }, // US metrics note (tracked in apps) :contentReference[oaicite:12]{index=12}
        unit: { type: String, trim: true }
      }
    ],
    trackProgress: { type: Boolean, default: true },
    progressValue: { type: Number, default: 0 }, // value-based progress
    progressPercent: { type: Number, default: 0 }, // 0..100
    status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', GoalSchema);
