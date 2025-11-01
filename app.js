// Load .env file
require('dotenv').config();

// Core dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import Routes
const contestEntryRoutes = require('./routes/contestEntryRoutes');
const contestRoutes = require('./routes/contestRoutes');
const walletRoutes = require('./routes/walletRoutes'); // ✅ Wallet routes
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Setup WebSocket
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your frontend
    credentials: true,
  },
});
// Make io globally accessible in other files
module.exports.io = io;

// Load custom WebSocket logic (if you have sockets like referral updates)
require('./sockets/referralSocket')(io);

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });


  const shopRoutes = require("./routes/shopRoutes");
app.use("/api/shop", shopRoutes);

/* API Routes */

// User & Auth
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/profile', require('./routes/profileRoutes'));

// Referrals
app.use('/api', require('./routes/referralRoutes'));
app.use("/api/orders", orderRoutes);

// Wallet
app.use('/api/wallet', walletRoutes);

// Contest & Entries
app.use('/api/contest-entries', contestEntryRoutes);
app.use('/api/contests', contestRoutes);

// Admin Panel APIs
app.use('/api/admin/users', require('./routes/userRoutes'));
app.use('/api/admin/orders', require('./routes/orderRoutes'));
app.use('/api/admin/products', require('./routes/productRoutes'));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin/settings', require('./routes/settingRoutes'));

app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running ✅');
});
//location
app.get("/api/office-location", (req, res) => {
  res.json({
    address: "My Office, Madhapur, Beside Metro Station, Pillar No 1178"
  });
});
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
}); 