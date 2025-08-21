const mongoose = require('mongoose');

const roles = ['admin', 'member'];

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      match: /^[a-zA-Z0-9_.-]+@Befab$/ // “username@Befab” format from spec
    }, // :contentReference[oaicite:0]{index=0}
    email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roles, default: 'member' }, // only Admin, Member per spec :contentReference[oaicite:1]{index=1}
    institution: { type: String, trim: true }, // SSO selected institution (optional) :contentReference[oaicite:2]{index=2}
    avatarUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
