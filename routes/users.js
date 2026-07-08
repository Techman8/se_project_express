const router = require("express").Router();

// Only import the specific handlers for the current logged-in user
const { getCurrentUser, updateProfile } = require("../controllers/users");

// All routes are scoped strictly to the authenticated caller
router.get("/me", getCurrentUser); // Handles GET /users/me
router.patch("/me", updateProfile); // Handles PATCH /users/me

module.exports = router;
