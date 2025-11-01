const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// GET /api/orders
router.get("/", orderController.getOrders);

// GET /api/orders/:id
router.get("/:id", orderController.getOrderById);

// PUT /api/orders/:id
router.put("/:id", orderController.updateOrderStatus);

// DELETE /api/orders/:id
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
