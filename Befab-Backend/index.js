require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const appRoutes = require("./routes/app");
const adminRoutes = require("./routes/admin");
// NOTE: your existing routes/authenticate.js should export an Express router
const authRoutes = require("./routes/authenticate");
const User = require("./models/user");

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "files/")));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Public auth routes
app.use("/auth", authRoutes);

// Protected routes (middleware is applied inside each router)
app.use("/app", appRoutes);
app.use("/admin", adminRoutes);

let interval = null;

app.post("/ping", async (req, res) => {
  try {
    const { userId } = req.body;
    const now = Date.now();

    // update this user as active
    const user = await User.findByIdAndUpdate(
      userId,
      { lastPing: now, isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // start cleanup interval only once
    if (!interval) {
      interval = setInterval(async () => {
        try {
          // mark inactive if lastPing older than 15s
          await User.updateMany(
            { isActive: true, lastPing: { $lt: Date.now() - 5000 } },
            { $set: { isActive: false } }
          );
        } catch (err) {
          console.error("Error updating user activity:", err);
        }
      }, 5000); // runs every 5s
    }

    res.json({ message: "pong", userId, active: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DB + Server
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/befab";

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
