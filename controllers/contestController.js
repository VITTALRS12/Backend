const Contest = require('../models/Contest');

// Create new contest (Admin)
exports.createContest = async (req, res) => {
  try {
    const { title, description, startDate, endDate, imageUrl, status } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, startDate, and endDate are required.' });
    }

    const contest = new Contest({
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      status: status || 'active'
    });

    await contest.save();
    res.status(201).json(contest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating contest', error: error.message });
  }
};

// Get active contests
exports.getActiveContests = async (req, res) => {
  try {
    const contests = await Contest.find({ status: 'active' });
    res.json(contests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching active contests', error: error.message });
  }
};

// Get completed contests
exports.getCompletedContests = async (req, res) => {
  try {
    const contests = await Contest.find({ status: 'completed' });
    res.json(contests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching completed contests', error: error.message });
  }
};

// Update contest (Admin)
exports.updateContest = async (req, res) => {
  try {
    const updated = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating contest', error: error.message });
  }
};

// Delete contest (Admin)
exports.deleteContest = async (req, res) => {
  try {
    const deleted = await Contest.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.json({ message: 'Contest deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting contest', error: error.message });
  }
};
