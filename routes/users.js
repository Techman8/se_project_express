const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");

// All routes are scoped strictly to the authenticated caller
router.get("/me", getCurrentUser); // Handles GET /users/me

// The validation middleware runs FIRST. If it fails, updateProfile never executes.
router.patch("/me", validateUpdateUser, updateProfile); // Handles PATCH /users/me


module.exports = router;
