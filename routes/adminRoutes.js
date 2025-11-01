// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/register', adminController.registerAdmin);

module.exports = router;
