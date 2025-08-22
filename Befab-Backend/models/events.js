const mongoose = require("mongoose");

const CompetitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'upcoming',
    },
    ip: {
      type: String,
    },
    location: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

CompetitionSchema.virtual('computedStatus').get(function() {
  const now = new Date();
  if (this.status === 'draft' || this.status === 'paused') {
    return this.status; // keep admin override
  }
  if (now < this.start) return 'upcoming';
  if (now >= this.start && now <= this.end) return 'active';
  if (now > this.end) return 'completed';
  return this.status; // fallback
});

// Optional: always update `status` before saving
CompetitionSchema.pre('save', function(next) {
  const now = new Date();
  if (this.status !== 'draft' && this.status !== 'paused') {
    if (now < this.start) this.status = 'upcoming';
    else if (now >= this.start && now <= this.end) this.status = 'active';
    else if (now > this.end) this.status = 'completed';
  }
  next();
});

const Event = mongoose.model("Event", CompetitionSchema);
module.exports = Event;
