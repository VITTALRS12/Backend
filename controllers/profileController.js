const User = require('../models/User');
const bcrypt = require('bcryptjs'); // ✅ correct
const { uploadToCloudinary } = require('../utils/cloudinary');

// =====================
// Get Full User Profile
// =====================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash -tokens -__v');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      profile: {
        id: user._id,
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profilePhoto: user.profilePhoto,
        referralCode: user.referralCode,
        joinDate: user.joinDate,
        initials: user.name?.split(' ').map(n => n[0]).join('')
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================
// Update Profile Info
// =====================
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender } = req.body;
    const updates = {};
    if (fullName) updates.name = fullName;
    if (dateOfBirth) updates.dateOfBirth = new Date(dateOfBirth);
    if (gender) updates.gender = gender;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true
    }).select('-passwordHash -tokens -__v');

    res.json({ success: true, message: 'Profile updated', profile: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =====================
// Upload Profile Photo
// =====================
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer); // assuming buffer from multer
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: result.secure_url },
      { new: true }
    ).select('-passwordHash -tokens -__v');

    res.json({ success: true, message: 'Profile photo updated', profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================
// Get All Addresses
// =====================
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================
// Add New Address
// =====================
exports.addAddress = async (req, res) => {
  try {
    const { name, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;
    const newAddress = { name, addressLine1, addressLine2, city, state, pincode, country, isDefault: !!isDefault };

    if (isDefault) {
      await User.updateOne(
        { _id: req.user._id, 'addresses.isDefault': true },
        { $set: { 'addresses.$.isDefault': false } }
      );
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: newAddress } },
      { new: true }
    );

    res.json({ success: true, message: 'Address added', addresses: user.addresses });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =====================
// Update Address
// =====================
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;

    if (updates.isDefault) {
      await User.updateOne(
        { _id: req.user._id, 'addresses.isDefault': true },
        { $set: { 'addresses.$.isDefault': false } }
      );
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'addresses._id': addressId },
      { $set: { 'addresses.$': updates } },
      { new: true }
    );

    res.json({ success: true, message: 'Address updated', addresses: user.addresses });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =====================
// Delete Address
// =====================
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);

    if (user.addresses.length === initialLength) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await user.save();
    res.json({ success: true, message: 'Address deleted', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =====================
// Change Password
// =====================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include a number'
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
