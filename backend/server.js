const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { getHomeData } = require('./controllers/userController');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Allow frontend to talk to backend during local development
app.use(cors({
  origin: '*', // In production, replace * with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ──────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/songs', require('./routes/songRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Homepage data route
app.get('/api/home', getHomeData);

// Health check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Spotify Clone API is running' });
});

// Handle unknown routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
