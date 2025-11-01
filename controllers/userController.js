const User = require('../models/User');

// @desc Get all users with pagination and search
exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const keyword = search ? { name: { $regex: search, $options: 'i' } } : {};

  const total = await User.countDocuments(keyword);
  const users = await User.find(keyword)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select('-password');

  res.json({
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    }
  });
};

// @desc Get single user by ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// @desc Update user by ID
exports.updateUser = async (req, res) => {
  const updates = req.body;
  const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
};

// @desc Delete user
exports.deleteUser = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted successfully' });
};
