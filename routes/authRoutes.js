const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate, protect, isAdmin } = require('../middlewares/authMiddleware');

// === Public Routes ===
router.post('/register', authController.registerUser);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin); // ✅ Admin login route
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

// === Authenticated User Route ===
router.get('/me', authenticate, authController.getMe);

// === Admin Protected Route ===
router.get('/admin/data', protect, isAdmin, (req, res) => {
  res.send({ message: 'This is protected admin data' });
});
router.post('/admin/login', authController.adminLogin);


module.exports = router;
