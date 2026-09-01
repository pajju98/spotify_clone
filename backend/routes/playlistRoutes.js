const express = require('express');
const router = express.Router();
const { createPlaylist, getMyPlaylists, getPlaylistById, updatePlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPlaylist);
router.get('/', protect, getMyPlaylists);
router.get('/:id', protect, getPlaylistById);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

module.exports = router;
