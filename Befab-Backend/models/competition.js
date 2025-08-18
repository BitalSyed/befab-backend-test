const mongoose = require("mongoose");

const CompetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    enum: ["Admin", "AI"], // restrict to specific types
    default: "Admin", // default type
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Upcoming", "Completed"],
    default: "Upcoming",
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true, // adds createdAt & updatedAt automatically
});

// Pre-save hook to auto-update status based on dates
CompetitionSchema.pre("save", function (next) {
  const now = new Date();
  if (this.end < now) {
    this.status = "Completed";
  } else if (this.start > now) {
    this.status = "Upcoming";
  } else {
    this.status = "Active";
  }
  next();
});

const Competition = mongoose.model("Competition", CompetitionSchema);
module.exports = Competition;
