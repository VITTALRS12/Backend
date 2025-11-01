const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const axios = require('axios');
const crypto = require('crypto');

// ✅ GET /api/wallet/balance
exports.getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    const balance = wallet ? wallet.balance : 0;
    res.json({ walletBalance: balance });
  } catch (err) {
    console.error('Get Wallet Balance Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ POST /api/wallet/add
exports.addTransaction = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required.' });
    }

    const orderId = `ORDER_${Date.now()}`;

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      amount: amount * 100,
      merchantUserId: req.user._id.toString(),
      redirectUrl: `${process.env.BASE_URL}/api/wallet/phonepe/callback`,
      callbackUrl: `${process.env.BASE_URL}/api/wallet/phonepe/webhook`,
      mobileNumber: req.user.phone,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64');

    const checksum = crypto
      .createHash('sha256')
      .update(payloadString + '/pg/v1/pay' + process.env.PHONEPE_SALT_KEY)
      .digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;

    const PHONEPE_BASE_URL = process.env.PHONEPE_ENV === 'production'
      ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
      : 'https://sandbox.phonepe.com/apis/hermes/pg/v1/pay';


      
    const response = await axios.post(
      PHONEPE_BASE_URL,
      { request: payloadString },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    console.log('PhonePe API Response:', response.data);

    if (response.data.success) {
      const paymentUrl = response.data.data.instrumentResponse.redirectInfo.url;
      return res.status(200).json({
        message: 'Payment initiated. Redirect user to complete payment.',
        paymentUrl,
        orderId
      });
    } else {
      return res.status(400).json({
        message: 'Failed to create payment.',
        details: response.data
      });
    }
  } catch (err) {
    console.error('PhonePe Initiate Payment Error:', err.response?.data || err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ GET /api/wallet/transactions
exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Get Transaction History Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
