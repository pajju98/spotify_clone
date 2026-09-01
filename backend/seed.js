const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Song.deleteMany();
    await Playlist.deleteMany();
    console.log('Old data cleared');

    // Create sample user
    const user = await User.create({
      name: 'Prajwal',
      email: 'prajwal@example.com',
      password: 'password123'
    });

    // Sample songs using free public MP3 URLs
    const songs = await Song.insertMany([
      {
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        albumImage: 'https://via.placeholder.com/300/1db954/ffffff?text=After+Hours',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 200,
        genre: 'Pop',
        playCount: 120
      },
      {
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: 'Divide',
        albumImage: 'https://via.placeholder.com/300/6b2d4a/ffffff?text=Divide',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: 234,
        genre: 'Pop',
        playCount: 98
      },
      {
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        albumImage: 'https://via.placeholder.com/300/4a6b2d/ffffff?text=Future+Nostalgia',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: 203,
        genre: 'Pop',
        playCount: 85
      },
      {
        title: 'Stay',
        artist: 'Kid LAROI & Justin Bieber',
        album: 'F*CK LOVE 3',
        albumImage: 'https://via.placeholder.com/300/6b4a2d/ffffff?text=Stay',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: 141,
        genre: 'Pop',
        playCount: 75
      },
      {
        title: 'Peaches',
        artist: 'Justin Bieber',
        album: 'Justice',
        albumImage: 'https://via.placeholder.com/300/2d6b6b/ffffff?text=Justice',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        duration: 198,
        genre: 'R&B',
        playCount: 60
      },
      {
        title: 'Montero',
        artist: 'Lil Nas X',
        album: 'Montero',
        albumImage: 'https://via.placeholder.com/300/6b2d6b/ffffff?text=Montero',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        duration: 137,
        genre: 'Hip-Hop',
        playCount: 55
      }
    ]);

    // Create sample playlist and add first 3 songs
    await Playlist.create({
      name: 'My Favourites',
      description: 'Songs I love',
      coverImage: 'https://via.placeholder.com/300/1db954/ffffff?text=My+Favourites',
      owner: user._id,
      songs: [songs[0]._id, songs[1]._id, songs[2]._id]
    });

    // Add liked songs to user
    user.likedSongs = [songs[0]._id, songs[2]._id];
    await user.save();

    console.log('✅ Seed data inserted successfully!');
    console.log('Test user: prajwal@example.com / password123');
    process.exit();
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
