const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  album: {
    type: String,
    default: 'Unknown Album',
    trim: true
  },
  albumImage: {
    type: String,
    default: ''
  },
  // URL to the audio file (mp3 or public URL)
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required']
  },
  duration: {
    type: Number, // duration in seconds
    default: 0
  },
  genre: {
    type: String,
    default: 'Unknown'
  },
  // How many times this song was played (for popular songs)
  playCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
