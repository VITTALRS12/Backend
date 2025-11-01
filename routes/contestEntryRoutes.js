const express = require('express');
const router = express.Router();
const entryController = require('../controllers/contestEntryController');
const { protect, authenticate, isAdmin } = require('../middlewares/authMiddleware');

// User routes (require login)
router.post('/', protect, entryController.submitEntry);
router.get('/my', protect, entryController.getMyEntries);

// Admin routes
router.get('/contest/:contestId', protect, isAdmin, entryController.getContestEntries);
router.put('/:id/status', protect, isAdmin, entryController.updateEntryStatus);

// Leaderboard route (public or protected—choose one)
router.get('/contest/:contestId/leaderboard', authenticate, entryController.getLeaderboard);
// OR:
// router.get('/contest/:contestId/leaderboard', protect, entryController.getLeaderboard);

module.exports = router;
