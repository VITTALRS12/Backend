const Referral = require('../models/Referral');

// GET /api/user/referral-stats
exports.getReferralStats = async (req, res) => {
  try {
    const stats = await Referral.findOne({ userId: req.user._id });
    if (!stats) return res.status(404).json({ success: false, message: 'Referral data not found' });

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/user/referrals
exports.getReferrals = async (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    const referral = await Referral.findOne({ userId: req.user._id });
    if (!referral) return res.status(404).json({ success: false, message: 'Referral data not found' });

    let referrals = referral.referrals;
    if (filter === 'paid') referrals = referrals.filter(r => r.status === 'paid');
    if (filter === 'unpaid') referrals = referrals.filter(r => r.status === 'unpaid');

    res.json({ success: true, data: referrals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.trackReferral = async (req, res) => {
  const { referralCode, name } = req.body;
  try {
    const referral = await Referral.findOne({ referralCode });
    if (!referral) return res.status(404).json({ success: false, message: 'Invalid referral code' });

    const newRef = {
      name,
      avatar: name[0].toUpperCase(),
      joinDate: new Date(),
      status: 'unpaid',
      earnings: 0
    };

    referral.referrals = referral.referrals || []; // ✅ Ensure it's initialized
    referral.referrals.push(newRef);
    referral.totalReferrals = (referral.totalReferrals || 0) + 1;

    await referral.save();

    req.io?.emit('referral-update', { userId: referral.userId, type: 'new-referral' });

    res.json({ success: true, message: 'Referral tracked.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
