const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');

// POST /api/playlists — create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const { name, description, coverImage } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Playlist name is required' });

    const playlist = await Playlist.create({
      name, description, coverImage,
      owner: req.user._id
    });

    res.status(201).json({ success: true, message: 'Playlist created successfully', data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/playlists — get all playlists of logged-in user
const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate('songs');
    res.status(200).json({ success: true, message: 'Playlists fetched successfully', data: playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/playlists/:id — get one playlist
const getPlaylistById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid playlist ID' });
    }

    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });

    res.status(200).json({ success: true, message: 'Playlist fetched successfully', data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/playlists/:id — rename or update playlist
const updatePlaylist = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid playlist ID' });
    }

    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found or not authorized' });

    const updated = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: 'Playlist updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/playlists/:id — delete a playlist
const deletePlaylist = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid playlist ID' });
    }

    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found or not authorized' });

    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/playlists/:id/songs — add song to playlist
const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ success: false, message: 'songId is required' });

    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found or not authorized' });

    // Avoid duplicate songs
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, message: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({ success: true, message: 'Song added to playlist', data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/playlists/:id/songs/:songId — remove song from playlist
const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found or not authorized' });

    playlist.songs = playlist.songs.filter(id => id.toString() !== req.params.songId);
    await playlist.save();

    res.status(200).json({ success: true, message: 'Song removed from playlist', data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPlaylist, getMyPlaylists, getPlaylistById, updatePlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist };
