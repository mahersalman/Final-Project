// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("🔴 Global Error Handler:", err.stack);

  // Default error response
  let error = {
    message: err.message || "An unexpected error occurred",
    status: err.status || 500,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    error.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === "ValidationError") {
    error.message = "Validation Error";
    error.status = 400;
    error.details = Object.values(err.errors).map((e) => e.message);
  }

  if (err.name === "CastError") {
    error.message = "Invalid ID format";
    error.status = 400;
  }

  if (err.code === 11000) {
    error.message = "Duplicate field value";
    error.status = 400;
  }

  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.status = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.status = 401;
  }

  res.status(error.status).json({
    success: false,
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(error.stack && { stack: error.stack }),
  });
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
};
