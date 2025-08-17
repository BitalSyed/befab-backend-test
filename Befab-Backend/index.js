const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app); // Create HTTP server from Express
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});
// const messages = require("./models/messages");

const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const cron = require("node-cron");
// const Log = require("./models/logs");
// const MessageGroup = require("./models/messageGroups");
// const GroupMessages = require("./models/groupMessages");

// daily at 2am
// cron.schedule("0 2 * * *", async () => {
//   const logs = await Log.find({ autoDelete: true });

//   for (const log of logs) {
//     const retentionMS = (log.retentionDays || 30) * 24 * 60 * 60 * 1000;
//     const deleteAt = new Date(log.timestamp.getTime() + retentionMS);

//     if (new Date() > deleteAt) {
//       await Log.deleteOne({ _id: log._id });
//       console.log(`Deleted log ${log._id}`);
//     } else {
//       // Optionally update lastCleanup
//       await Log.updateOne({ _id: log._id }, { lastCleanup: new Date() });
//     }
//   }
// });

// MongoDB
mongoose
  .connect("mongodb://localhost/befab", {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));
// mongoose
//   .connect("mongodb+srv://husnain612989:kUnqgH5UDKpxqUhq@ncchatter.vgqnoln.mongodb.net/?retryWrites=true&w=majority&appName=ncchatter", {})
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static frontend
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/", express.static(path.join(__dirname, "files")));
app.set("views", path.join(__dirname, "/build"));

// Routes
app.get("/", (req, res) => res.send("BeFab"));
app.get("/signup", (req, res) => res.json({ message: "Signup Sucessful" }));
app.post("/signup", (req, res) => {
  console.log(req.body);
  res.json({ message: "Signup Sucessful" });
});
app.use("/auth", require("./routes/authenticate"));
// app.use("/member", require("./routes/member/dashboard"));
app.use("/admin", require("./routes/admin"));
// app.use("/messages", require("./routes/messages"));

// io.on("connection", (socket) => {
//   // Step 1: Let frontend send the user's MongoDB _id after connection
//   socket.on("register", async (mongoUserId) => {
//     socket.join(mongoUserId);
//     socket.mongoUserId = mongoUserId; // ✅ Save to socket object

//     // const userGroups = await MessageGroup.find({ members: mongoUserId });
//     // userGroups.forEach((group) => {
//     //   socket.join(group._id.toString()); // Join group rooms
//     // });
//   });

//   socket.on("createGroup", async ({ groupName, memberIds }) => {
//     const group = new MessageGroup({
//       name: groupName,
//       members: [...new Set([...memberIds, socket.mongoUserId])],
//     });

//     await MessageGroup.save();

//     // Join the room
//     socket.join(group._id.toString());

//     // Notify members (optional)
//     memberIds.forEach((id) => {
//       io.to(id).emit("groupCreated", {
//         groupId: group._id,
//         name: group.name,
//         members: group.members,
//       });
//     });
//   });

//   socket.on("sendGroupMessage", async ({ groupId, message }) => {
//     const fromUserId = socket.mongoUserId;

//     const msg = await new GroupMessages({
//       senderId: fromUserId,
//       groupId,
//       content: message,
//       readBy: [fromUserId],
//     });
//     await msg.save();

//     io.to(groupId).emit("receiveGroupMessage", {
//       groupId,
//       from: fromUserId,
//       message,
//       id: msg._id,
//       createdAt: msg.createdAt,
//     });
//   });

//   socket.on("readGroupMessage", async ({ groupId, id }) => {
//     const userId = socket.mongoUserId;

//     const msg = await GroupMessages.findOne({ _id: id });
//     if (msg && !msg.readBy.includes(userId)) {
//       msg.readBy.push(userId);
//       await msg.save();
//     }

//     io.to(groupId).emit("groupMessageRead", {
//       messageId: id,
//       userId,
//     });
//   });

//   // Step 3: When sending a message
//   socket.on("sendMessage", async ({ toUserId, message }) => {
//     const fromUserId = socket.mongoUserId;
//     console.log(fromUserId, toUserId, message);
//     // ✅ Save to MongoDB
//     const msg = await new messages({
//       senderId: fromUserId,
//       recepientId: toUserId,
//       content: message,
//     });
//     await msg.save();

//     // ✅ Emit to receiver
//     io.to(toUserId).emit("receiveMessage", {
//       from: fromUserId,
//       message, // msg id
//       id: msg._id,
//     });

//     // ✅ Emit to update to update id
//     io.to(fromUserId).emit("updateMessage", {
//       id: msg._id,
//       message,
//       createdAt: msg.createdAt,
//     });
//   });

//   // Step 3: When sending a message
//   socket.on("read", async ({ toUserId, id }) => {
//     const readerUserId = socket.mongoUserId;

//     // ✅ Save to MongoDB
//     const msg = await messages.findOne({
//       _id: id,
//     });
//     if (msg) {
//       msg.read = true;
//       console.log(id, msg.read);
//       await msg.save();
//     }

//     // ✅ Emit to receiver
//     io.to(toUserId).emit("readMessage", {
//       from: readerUserId,
//       id: id,
//     });
//   });
// });

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
