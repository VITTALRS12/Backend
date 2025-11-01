const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: { type: String, required: true, unique: true },
  referralLink: { type: String, required: true },
  totalReferrals: { type: Number, default: 0 },
  paidReferrals: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  referrals: [
    {
      name: String,
      avatar: String,
      joinDate: Date,
      status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
      earnings: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
