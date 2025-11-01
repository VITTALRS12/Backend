const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.get('/', settingController.getSettings);
router.get('/:key', settingController.getSetting);
router.post('/', settingController.setSetting);
router.delete('/:key', settingController.deleteSetting);

module.exports = router;
