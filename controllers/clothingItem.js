const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR,
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(CREATED).json({ data: item });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).json({ data: items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK).json({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested resource not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid request parameters" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  // Step 1: Just find the item first
  return ClothingItem.findById(itemId)
    .orFail() // Throws DocumentNotFoundError if the card doesn't exist
    .then((item) => {
      // Step 2: Check if the current user actually owns this item
      if (item.owner.toString() !== currentUserId.toString()) {
        // Step 3a: If they don't match, block the deletion with a 403
        return res
          .status(FORBIDDEN)
          .json({ message: "You are not authorized to delete this item" });
      }

      // Step 3b: If they DO match, safely proceed with the deletion
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(OK).json({ message: "Item has been successfully deleted" })
      );
    })
    .catch((err) => {
      console.error(err);
      // 1. Handle case where the item doesn't exist
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested item not found" });
      }

      // 2. Handle a malformed or corrupt item ID string
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid item ID parameters" });
      }

      // 3. Fallback for unexpected database errors
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested resource not found" });
      }
      return res.json({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested resource not found" });
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
