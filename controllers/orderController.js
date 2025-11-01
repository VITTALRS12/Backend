const Order = require("../models/Order");
const User = require("../models/User");

// @desc Get all orders with filters and pagination
exports.getOrders = async (req, res) => {
  const { page = 1, limit = 10, status = "", search = "" } = req.query;

  const filters = {};
  if (status) filters.status = status;

  if (search) {
    const users = await User.find({
      name: { $regex: search, $options: "i" }
    }).select("_id");
    const userIds = users.map((u) => u._id);
    filters.userId = { $in: userIds };
  }

  const total = await Order.countDocuments(filters);

  const orders = await Order.find(filters)
    .populate("userId", "name email")
    .populate("products.productId", "name")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  });
};

// @desc Get single order
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email")
    .populate("products.productId", "name");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

// @desc Update order status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Order not found" });
  res.json(updated);
};

// @desc Delete an order
exports.deleteOrder = async (req, res) => {
  const deleted = await Order.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Order not found" });
  res.json({ message: "Order deleted" });
};
