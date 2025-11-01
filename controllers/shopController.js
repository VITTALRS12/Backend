const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Product = require("../models/Product");
const Order = require("../models/Order");

// List products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Get single product
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// Initiate Razorpay payment
exports.initiateRazorpayPayment = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Product and quantity required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const totalAmount = product.price * quantity * 100; // paise

  const options = {
    amount: totalAmount,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`
  };

  const razorpayOrder = await razorpay.orders.create(options);

  const order = new Order({
    userId: req.user._id,
    products: [{
      productId: product._id,
      quantity,
      price: product.price
    }],
    totalAmount: totalAmount / 100,
    paymentMethod: "razorpay",
    status: "pending"
  });

  await order.save();

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    orderId: order._id,
    key: process.env.RAZORPAY_KEY_ID
  });
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: "paid" },
    { new: true }
  );

  res.json({ message: "Payment verified successfully", order: updatedOrder });
};

