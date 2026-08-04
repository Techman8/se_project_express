// utils/config.js

// A strong fallback key for local development
const  { JWT_SECRET = "super-strong-development-secret-key" } = process.env;

module.exports = {
  JWT_SECRET,
};
