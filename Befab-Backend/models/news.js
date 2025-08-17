const mongoose = require("mongoose");

const NewsletterSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  picture: { 
    type: String, // URL to the newsletter image
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

const Newsletter = mongoose.model("Newsletter", NewsletterSchema);
module.exports = Newsletter;