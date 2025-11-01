const Setting = require('../models/Setting');

// @desc Get all settings
exports.getSettings = async (req, res) => {
  const settings = await Setting.find();
  res.json(settings);
};

// @desc Get setting by key
exports.getSetting = async (req, res) => {
  const setting = await Setting.findOne({ key: req.params.key });
  if (!setting) return res.status(404).json({ message: 'Setting not found' });
  res.json(setting);
};

// @desc Create or update setting
exports.setSetting = async (req, res) => {
  const { key, value } = req.body;
  const updated = await Setting.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
  res.json(updated);
};

// @desc Delete setting
exports.deleteSetting = async (req, res) => {
  const deleted = await Setting.findOneAndDelete({ key: req.params.key });
  if (!deleted) return res.status(404).json({ message: 'Setting not found' });
  res.json({ message: 'Setting deleted' });
};
