const router = require("express").Router();
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const { validateCardBody, validateId } = require("../middlewares/validation");

// Validate body parameters before creating an item
router.post("/", validateCardBody, createItem);

// Validate that itemId is a valid 24-character hex string before interacting with items
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;
