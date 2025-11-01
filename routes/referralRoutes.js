const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/user/referral-stats', protect, referralController.getReferralStats);
router.get('/user/referrals', protect, referralController.getReferrals);
router.post('/referral/track', referralController.trackReferral); // no auth to allow public signup

module.exports = router;
