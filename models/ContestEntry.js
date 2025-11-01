const mongoose = require('mongoose');

const contestEntrySchema = new mongoose.Schema({
  contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submission: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: 'Submission must be exactly 12 digits.'
    }
  },
  score: { type: String }, // Sorted digits for leaderboard
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'winner', 'loser'], default: 'pending' },
  prize: String
}, { timestamps: true });

module.exports = mongoose.model('ContestEntry', contestEntrySchema);
