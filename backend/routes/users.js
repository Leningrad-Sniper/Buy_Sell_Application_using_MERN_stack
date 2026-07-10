const express = require('express');
const router = express.Router();
const { updateProfile, getProfile, getUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/:userId', auth, getUserProfile);

module.exports = router; 