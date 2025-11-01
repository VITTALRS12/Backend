const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const { authenticate } = require("../middlewares/authMiddleware");

// List all products
router.get("/products", shopController.getProducts);

// Get single product
router.get("/products/:id", shopController.getProductById);

// Initiate payment
router.post("/buy/initiate", authenticate, shopController.initiateRazorpayPayment);

// Verify payment
router.post("/buy/verify", authenticate, shopController.verifyRazorpayPayment);

module.exports = router;
