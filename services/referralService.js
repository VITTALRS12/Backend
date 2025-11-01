// const Referral = require('../models/Referral');

// exports.getStats = async (userId) => {
//   const referral = await Referral.findOne({ userId });
//   if (!referral) return {};
//   const { totalReferrals, paidReferrals, totalEarnings } = referral;
//   return { totalReferrals, paidReferrals, totalEarnings };
// };

// exports.getReferrals = async (userId, page, limit) => {
//   const referral = await Referral.findOne({ userId });
//   if (!referral) return [];
//   const start = (page - 1) * limit;
//   return referral.referrals.slice(start, start + limit);
// };

// exports.track = async (referralCode, name) => {
//   const referral = await Referral.findOne({ referralCode });
//   if (!referral) throw new Error('Invalid referral code');
//   const newReferral = {
//     name,
//     avatar: name.charAt(0).toUpperCase(),
//     joinDate: new Date(),
//     status: 'unpaid',
//     earnings: 0
//   };
//   referral.referrals.push(newReferral);
//   referral.totalReferrals += 1;
//   await referral.save();
//   return { success: true };
// };

// exports.getEarnings = async (userId) => {
//   const referral = await Referral.findOne({ userId });
//   if (!referral) return { totalEarnings: 0, details: [] };
//   return {
//     totalEarnings: referral.totalEarnings,
//     details: referral.referrals.filter(r => r.earnings > 0)
//   };
// };
