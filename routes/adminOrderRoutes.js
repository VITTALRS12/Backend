const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminAuth");

// All routes protected and admin-only
router.use(protect);
router.use(adminOnly);

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
