const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metrics', dashboardController.getDashboardMetrics);
router.get('/charts/user-growth', dashboardController.getUserGrowth);
router.get('/charts/order-analytics', dashboardController.getOrderAnalytics);

module.exports = router;
