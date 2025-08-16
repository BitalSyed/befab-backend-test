const mongoose = require("mongoose");
const ChatRoomSchema = new mongoose.Schema({
  type: { type: String, enum: ["direct", "group"], required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupName: String,
  groupAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const MessageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  attachments: [String], // file URLs
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      type: String,
    },
  ],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});
const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
const Message = mongoose.model("Message", MessageSchema);
module.exports = { ChatRoom, Message };
