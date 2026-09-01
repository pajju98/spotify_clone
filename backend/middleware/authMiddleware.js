const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — only logged-in users can access
const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
