const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticate } = require('../middlewares/authMiddleware');

// Get wallet balance
router.get('/balance', authenticate, walletController.getWalletBalance);

// Add transaction
router.post('/add', authenticate, walletController.addTransaction);

// Get transaction history
router.get('/transactions', authenticate, walletController.getTransactionHistory);

module.exports = router;
