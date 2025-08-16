const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  profession: { type: String },
  bio: { type: String },
  profilePhoto: { type: String }, // URL
  email: { type: String, required: true, unique: true },
  password: { type: String},
  emailtfa: { type: String },
  phone: { type: String },
  tfa: { type: String },

  // Extra features
  interests: [String], 
  skills: [String],
  pronouns: { type: String },
  privacySettings: {
    showEmail: { type: Boolean, default: false },
    visibleFields: [String], // e.g. ['firstName', 'bio']
  },

  role: [{
    type: String,
    enum: ["admin", "member", "moderator"],
    default: "member",
  }],
  badges: [String],
  points: { type: Number, default: 0 },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  },
  createdAt: { type: Date, default: Date.now() },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
