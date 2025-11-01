const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Admin routes
router.post('/', authenticate, isAdmin, contestController.createContest);
router.put('/:id', authenticate, isAdmin, contestController.updateContest);
router.delete('/:id', authenticate, isAdmin, contestController.deleteContest);

// Public routes
router.get('/active', contestController.getActiveContests);
router.get('/completed', contestController.getCompletedContests);

module.exports = router;
