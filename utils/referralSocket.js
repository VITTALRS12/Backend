const { io } = require('../server');

exports.broadcastToUser = (userId, payload) => {
  if (!io) return;
  io.to(userId).emit('referral:update', payload);
};
