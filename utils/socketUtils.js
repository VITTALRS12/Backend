// utils/socketUtils.js
const { io } = require("../server");

/**
 * Broadcast a real-time referral update to a specific user.
 * @param {string} userId - The ID or room of the user.
 * @param {object} payload - The data to send.
 */
exports.broadcastToUser = (userId, payload) => {
  if (!io) return console.warn("⚠️ Socket.io instance not found.");
  io.to(userId).emit("referral:update", payload);
};
