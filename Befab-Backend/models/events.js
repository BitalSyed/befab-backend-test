const mongoose = require("mongoose");

const CompetitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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

const Event = mongoose.model("Event", CompetitionSchema);
module.exports = Event;
