module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('joinReferralRoom', (userId) => {
      socket.join(userId);
      console.log(`📢 User ${userId} joined their referral room`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
};
