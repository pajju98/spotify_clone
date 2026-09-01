const express = require('express');
const router = express.Router();
const { getAllSongs, searchSongs, getSongById, createSong, updateSong, deleteSong, likeSong, unlikeSong } = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');

// Search must come BEFORE /:id so it doesn't get treated as an ID
router.get('/search', searchSongs);

router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/', protect, createSong);
router.put('/:id', protect, updateSong);
router.delete('/:id', protect, deleteSong);

// Like / Unlike
router.post('/:id/like', protect, likeSong);
router.delete('/:id/like', protect, unlikeSong);

module.exports = router;
