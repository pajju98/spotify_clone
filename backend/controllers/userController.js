const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

// GET /api/users/me/liked-songs
const getLikedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('likedSongs');
    res.status(200).json({ success: true, message: 'Liked songs fetched', data: user.likedSongs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/me/recently-played/:songId
const addRecentlyPlayed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const songId = req.params.songId;

    // Remove if already exists so we move it to the top
    user.recentlyPlayed = user.recentlyPlayed.filter(
      item => item.song.toString() !== songId
    );

    // Add to the beginning
    user.recentlyPlayed.unshift({ song: songId, playedAt: new Date() });

    // Keep only latest 20
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 20);

    await user.save();

    res.status(200).json({ success: true, message: 'Recently played updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/me/recently-played
const getRecentlyPlayed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('recentlyPlayed.song');
    res.status(200).json({ success: true, message: 'Recently played fetched', data: user.recentlyPlayed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/home — homepage data
const getHomeData = async (req, res) => {
  try {
    const featuredSongs    = await Song.find().sort({ playCount: -1 }).limit(5);
    const recentSongs      = await Song.find().sort({ createdAt: -1 }).limit(10);
    const popularSongs     = await Song.find().sort({ playCount: -1 }).limit(10);
    const playlists        = await Playlist.find().limit(6).populate('songs');

    // Get unique albums from songs
    const allSongs = await Song.find({}, 'album albumImage artist');
    const albumMap = {};
    allSongs.forEach(s => {
      if (s.album && !albumMap[s.album]) {
        albumMap[s.album] = { album: s.album, albumImage: s.albumImage, artist: s.artist };
      }
    });
    const albums = Object.values(albumMap).slice(0, 8);

    res.status(200).json({
      success: true,
      message: 'Home data fetched successfully',
      data: { featuredSongs, recentSongs, popularSongs, playlists, albums }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLikedSongs, addRecentlyPlayed, getRecentlyPlayed, getHomeData };
