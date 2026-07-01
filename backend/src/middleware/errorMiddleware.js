const logger = require("../utils/logger");

// Catches errors thrown anywhere in the request flow and returns a clean JSON response
const errorMiddleware = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

// Catches requests to routes that don't exist
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

module.exports = { errorMiddleware, notFound };