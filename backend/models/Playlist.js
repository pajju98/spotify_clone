const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  // The user who created this playlist
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Array of song references
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
