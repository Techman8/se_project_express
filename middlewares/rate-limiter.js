const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  message: { message: "Too many requests from this IP, please try again later." },
  standardHeaders: 'draft-7', // Use standard RateLimit headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});

module.exports = limiter;