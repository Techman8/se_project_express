const router = require("express").Router();

const {
  createItem,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", createItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
