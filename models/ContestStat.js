const mongoose = require('mongoose');

const contestStatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  highestScore: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  lastAttemptAt: { type: Date, default: null }
});

module.exports = mongoose.model('ContestStat', contestStatSchema);
