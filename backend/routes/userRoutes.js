const express = require('express');
const router = express.Router();
const { getLikedSongs, addRecentlyPlayed, getRecentlyPlayed, getHomeData } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me/liked-songs', protect, getLikedSongs);
router.post('/me/recently-played/:songId', protect, addRecentlyPlayed);
router.get('/me/recently-played', protect, getRecentlyPlayed);

module.exports = router;
