const Contest = require('../models/Contest');
const ContestEntry = require('../models/ContestEntry');

// Submit contest entry (User)
exports.submitEntry = async (req, res) => {
  try {
    const { contestId, submission } = req.body;

    if (!/^\d{12}$/.test(submission)) {
      return res.status(400).json({ message: 'Submission must be exactly 12 digits.' });
    }

    const contest = await Contest.findOne({ _id: contestId, status: 'active' });
    if (!contest) {
      return res.status(400).json({ message: 'Contest not found or not active.' });
    }

    const existing = await ContestEntry.findOne({
      contest: contestId,
      user: req.user._id
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already participated in this contest.' });
    }

    // Compute score: ascending digits
    const score = submission.split('').sort().join('');

    const entry = new ContestEntry({
      contest: contestId,
      user: req.user._id,
      submission,
      score
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting entry', error: error.message });
  }
};

// Get entries of current user
exports.getMyEntries = async (req, res) => {
  try {
    const entries = await ContestEntry.find({ user: req.user._id }).populate('contest');
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching entries', error: error.message });
  }
};

// Get entries of a contest (Admin)
exports.getContestEntries = async (req, res) => {
  try {
    const entries = await ContestEntry.find({ contest: req.params.contestId }).populate('user');
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching contest entries', error: error.message });
  }
};

// Get leaderboard for a contest
exports.getLeaderboard = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found.' });
    }

    const entries = await ContestEntry.find({ contest: contest._id })
      .populate('user', 'name email')
      .sort({ score: -1, submittedAt: 1 }); // Higher score first, earlier submission wins tie

    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching leaderboard', error: error.message });
  }
};

// Update entry status (Admin)
exports.updateEntryStatus = async (req, res) => {
  try {
    const { status, prize } = req.body;

    const entry = await ContestEntry.findByIdAndUpdate(
      req.params.id,
      { status, prize },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating entry', error: error.message });
  }
};
