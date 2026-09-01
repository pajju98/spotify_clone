const mongoose = require('mongoose');
const Song = require('../models/Song');

// GET /api/songs — get all songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Songs fetched successfully', data: songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/songs/search?q=text — search songs by title, artist, album
const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query is required' });

    // Case-insensitive search across 3 fields
    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { album: { $regex: q, $options: 'i' } }
      ]
    });

    res.status(200).json({ success: true, message: 'Search results', data: songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/songs/:id — get one song by ID
const getSongById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid song ID' });
    }

    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    res.status(200).json({ success: true, message: 'Song fetched successfully', data: song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/songs — add a new song (admin)
const createSong = async (req, res) => {
  try {
    const { title, artist, album, albumImage, audioUrl, duration, genre } = req.body;

    if (!title || !artist || !audioUrl) {
      return res.status(400).json({ success: false, message: 'Title, artist and audioUrl are required' });
    }

    const song = await Song.create({ title, artist, album, albumImage, audioUrl, duration, genre });
    res.status(201).json({ success: true, message: 'Song added successfully', data: song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/songs/:id — update a song
const updateSong = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid song ID' });
    }

    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    res.status(200).json({ success: true, message: 'Song updated successfully', data: song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/songs/:id — delete a song
const deleteSong = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid song ID' });
    }

    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    res.status(200).json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/songs/:id/like — like a song
const likeSong = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid song ID' });
    }

    const user = req.user;

    // Add song to likedSongs if not already liked
    if (user.likedSongs.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Song already liked' });
    }

    user.likedSongs.push(req.params.id);
    await user.save();

    res.status(200).json({ success: true, message: 'Song liked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/songs/:id/like — unlike a song
const unlikeSong = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid song ID' });
    }

    const user = req.user;
    user.likedSongs = user.likedSongs.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.status(200).json({ success: true, message: 'Song unliked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllSongs, searchSongs, getSongById, createSong, updateSong, deleteSong, likeSong, unlikeSong };
