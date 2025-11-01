const mongoose = require('mongoose');

const referralConfigSchema = new mongoose.Schema({
  signupReward: { type: Number, default: 50 },
  paymentReward: { type: Number, default: 100 },
  contestUnlockThreshold: { type: Number, default: 3 },
  prizeSharingEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ReferralConfig', referralConfigSchema);
