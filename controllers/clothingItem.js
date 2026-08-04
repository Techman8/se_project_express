const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
const { OK, CREATED } = require("../utils/success");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(CREATED).json({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data. Please check your inputs and try again."));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).json({ data: items }))
    .catch(next); // Shortcut for .catch((err) => next(err))
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  return ClothingItem.findById(itemId)
    .orFail() // Throws DocumentNotFoundError if the card doesn't exist
    .then((item) => {
      if (item.owner.toString() !== currentUserId.toString()) {
        throw new ForbiddenError("You are not authorized to delete this item");
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(OK).json({ message: "Item has been successfully deleted" })
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested item not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID parameters"));
      } else {
        next(err);
      }
    });
};

// LIKE ITEM CONTROLLER
const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail() // Throws DocumentNotFoundError if the item ID doesn't exist
    .then((item) => res.status(OK).json({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid request parameters"));
      } else {
        next(err);
      }
    });
};

// DISLIKE ITEM CONTROLLER
const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail() // Throws DocumentNotFoundError if the item ID doesn't exist
    .then((item) => res.status(OK).json({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid request parameters"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
