const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  auth: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sleep: { duration: {type: Number},
    deep: { type: Number },
    remSleep: { type: Number },
    quality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
  },
  heartRate: { type: Number },
  steps: { type: Number },
  distance: { type: Number },
  bp: { type: Number },
  oxygen: { type: Number },
  respiratoryRate: { type: Number },
  weight: { type: Number },
  bmi: { type: Number },
  bodyFat: { type: Number },
  leanMass: { type: Number },
  bloodGlucose: { type: Number },
  temperature: { type: Number },
  height: { type: Number },
  createdAt: { type: Date, default: Date.now },
});
const Fitness = mongoose.model("fitness", UserSchema);
module.exports = Fitness;
