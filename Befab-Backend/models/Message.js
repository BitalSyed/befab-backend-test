const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    mediaUrl: { type: String }, // supports images & videos per spec :contentReference[oaicite:22]{index=22}
    mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' }
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessageAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = {
  Chat: mongoose.model('Chat', ChatSchema),
  Message: mongoose.model('Message', MessageSchema)
};
