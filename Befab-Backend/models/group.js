const mongoose = require("mongoose");
const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  coverImage: String,
  type: {
    type: String,
    enum: ["public", "private", "secret"],
    default: "public",
  },

  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: String,
    },
  ],
  tags: [String],

  settings: {
    postApproval: { type: Boolean, default: false },
    allowedRolesToPost: [String],
  },

  createdAt: { type: Date, default: Date.now },
});
const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
