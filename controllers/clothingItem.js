const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  FORBIDDEN,
} = require("../utils/errors");

const { OK, CREATED } = require("../utils/success");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(CREATED).json({ data: item });
    })
    .catch((err) => {
      // Check for Mongoose validation errors
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({
          message: "Invalid data. Please check your inputs and try again.",
        });
      }

      // Fallback for all other server errors
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "An error occurred on the server",
      });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(OK).json({ data: items }))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" })
    );

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

// 5. LIKE ITEM CONTROLLER
const likeItem = (req, res) => {
  const { itemId } = req.params;
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail() // Throws DocumentNotFoundError if the item ID doesn't exist
    .then((item) => res.status(OK).json({ data: item }))
    .catch((err) => {
      // 1. Handle case where the item doesn't exist in the database
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested resource not found" });
      }
      // 2. Handle a malformed or corrupt item ID string in the URL
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid request parameters" });
      }
      // 3. Fallback for unexpected database errors
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

// 6. DISLIKE ITEM CONTROLLER
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail() // Throws DocumentNotFoundError if the item ID doesn't exist
    .then((item) => res.status(OK).json({ data: item }))
    .catch((err) => {
      // 1. Handle case where the item doesn't exist in the database
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested resource not found" });
      }
      // 2. Handle a malformed or corrupt item ID string in the URL
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid request parameters" });
      }
      // 3. Fallback for unexpected database errors
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
