const express = require("express");
const app = express.Router();
// const users = require("../../models/users");
const transporter = require("../config/transporter.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const Log = require("../../models/logs.js");
const mongoose = require("mongoose");
// const passport = require("passport");
// const session = require("express-session");
const user = require("../models/user.js");
const Log = require("../models/logs.js");
// const samlStrategy = require("./samlStrategy.js");

const Email = process.env.EMAIL;

// Message, To
async function sms(m, t, link) {
  console.log(m, t);
  return true;
}

// Message, To
async function email(m, t, link) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: Email, // not Email (was probably undefined)
      to: t,
      subject: "Your OTP Code",
      text: `Your OTP is: ${m} ${link ? `\n\nLink to Verify: ${link}` : ""}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(false);
      } else {
        console.log("Email sent:", info.response);
        resolve(true);
      }
    });
  });
}

function isEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

function isPhoneNumber(input) {
  const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\d{10,14})$/;
  return phoneRegex.test(input);
}

function validateInput(input) {
  if (isEmail(input)) {
    return { type: "email", valid: true };
  } else if (isPhoneNumber(input)) {
    return { type: "phone", valid: true };
  } else {
    return { type: "unknown", valid: false };
  }
}

const generateToken = (user, time) => {
  const secret = process.env.JWT_SECRET || "SkillRex-Tech"; // better to use env var

  const token = jwt.sign({ email: user }, secret, {
    expiresIn: `${time}d`, // or '1h', '15m', etc.
  });

  return token;
};

const generateTokenWithoutExpiry = (user) => {
  const secret = process.env.JWT_SECRET || "SkillRex-Tech"; // Use env var in production

  // No expiresIn property here
  const token = jwt.sign({ email: user }, secret);

  return token;
};

const uploadDir = path.resolve(__dirname, process.env.PROFILE_STORAGE);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.post("/get", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Session Expired" });
  }

  const email= jwt.verify(token, process.env.JWT_SECRET || "SkillRex-Tech").email;

  // Find user by email
  const u = await user.findOne({ email: email });
  if (!u) {
    return res.status(401).json({ error: "User Not Found" });
  }

  // await createSystemLog(
  //   user._id,
  //   "Logged-in",
  //   `${user.firstName} Logged-in as Admin`
  // );

  return res.json({
    u
  });
});

// *****Dashboard*****
app.post("/dashboard", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Session Expired" });
  }

  const email= jwt.verify(token, process.env.JWT_SECRET || "SkillRex-Tech").email;

  // Find user by email
  const u = await user.findOne({ email: email });
  if (!u) {
    return res.status(401).json({ error: "User Not Found" });
  }



  // await createSystemLog(
  //   user._id,
  //   "Logged-in",
  //   `${user.firstName} Logged-in as Admin`
  // );

  return res.json({
    u
  });
});

// *****Users*****
app.post("/users", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Session Expired" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SkillRex-Tech");
    const email = decoded.email;

    // Find current user
    const currentUser = await user.findOne({ email });
    if (!currentUser) {
      return res.status(401).json({ error: "User Not Found" });
    }

    // Get all other users except me
    const otherUsers = await user.find({ _id: { $ne: currentUser._id } });

    // Logs excluding mine, latest 5
    const logs = await Log.find({  })
      .sort({ createdAt: -1 })
      .limit(5).populate("user");

    // Count totals
    const totalUsers = await user.countDocuments();
    const adminCount = await user.countDocuments({ role: "admin" });
    const memberCount = await user.countDocuments({ role: "member" });

    // Active/Inactive in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find distinct user IDs with logs in last 7 days
    const activeUserIds = await Log.distinct("user", { createdAt: { $gte: sevenDaysAgo } });

    const activeUsersCount = await user.countDocuments({
      _id: { $in: activeUserIds.map(id => new mongoose.Types.ObjectId(id)) }
    });

    const inactiveUsersCount = totalUsers - activeUsersCount;

    return res.json({
      currentUser,
      otherUsers,
      logs,
      counts: {
        totalUsers,
        adminCount,
        memberCount
      },
      activity: {
        activeUsers: activeUsersCount,
        inactiveUsers: inactiveUsersCount
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = app;
