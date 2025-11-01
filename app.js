// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// ✅ STEP 1: Configure CORS before routes and Socket.io
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local frontend
      "https://frontend-uowe.onrender.com"  // deployed frontend
    ],
    credentials: true,
  })
);
app.use(express.json());

// ✅ STEP 2: Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ STEP 3: Setup Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://frontend-uowe.onrender.com",
    ],
    credentials: true,
  },
});
module.exports.io = io;

// ✅ STEP 4: Socket Logic (if applicable)
require("./sockets/referralSocket")(io);

// ✅ STEP 5: Import Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const referralRoutes = require("./routes/referralRoutes");
const walletRoutes = require("./routes/walletRoutes");
const contestRoutes = require("./routes/contestRoutes");
const contestEntryRoutes = require("./routes/contestEntryRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingRoutes = require("./routes/settingRoutes");
const shopRoutes = require("./routes/shopRoutes");

// ✅ STEP 6: Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", referralRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/contest-entries", contestEntryRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/orders", orderRoutes);

// Admin routes
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/settings", settingRoutes);

// ✅ STEP 7: Utility routes
app.get("/", (req, res) => res.send("✅ Backend API is live on Render"));
app.get("/api/office-location", (req, res) =>
  res.json({
    address: "My Office, Madhapur, Beside Metro Station, Pillar No 1178",
  })
);

// ✅ STEP 8: Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
