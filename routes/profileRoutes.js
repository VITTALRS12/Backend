const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ----------- Profile Routes -----------
router.get('/', verifyToken, profileController.getProfile);
router.put('/', verifyToken, profileController.updateProfile);
router.post('/photo', verifyToken, upload.single('photo'), profileController.uploadPhoto);

// ----------- Address Routes -----------
router.get('/addresses', verifyToken, profileController.getAddresses);
router.post('/addresses', verifyToken, profileController.addAddress);
router.put('/addresses/:addressId', verifyToken, profileController.updateAddress);
router.delete('/addresses/:addressId', verifyToken, profileController.deleteAddress);

// ----------- Password Route -----------
router.post('/change-password', verifyToken, profileController.changePassword);

module.exports = router;
