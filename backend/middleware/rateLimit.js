const rateLimit = require("express-rate-limit");

const forgotLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { forgotLimiter };
