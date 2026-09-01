// Global error handler — catches any error passed via next(error)
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    // Show stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Handle 404 routes not found
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
