// razorpayService.js
const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order for Razorpay payment
exports.createOrder = async (amount) => {
  try {
    const orderOptions = {
      amount: amount * 100, // Convert amount to paise (1 INR = 100 paise)
      currency: 'INR', // Set currency to INR
      receipt: 'receipt_' + new Date().getTime(), // Unique receipt ID based on timestamp
      payment_capture: 1, // Automatic payment capture
    };

    const order = await razorpay.orders.create(orderOptions); // Call Razorpay API to create the order
    return order;
  } catch (error) {
    throw new Error('Failed to create order: ' + error.message);
  }
};
