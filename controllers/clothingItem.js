const ClothingItem = require("../models/clothingItem");
const {
  internalserverError,
  Ok,
  badRequest,
  notFound,
  Created,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(Created).json({ data: item });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(internalserverError)
        .json({ message: "An error occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(Ok).json({ data: items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(internalserverError)
        .json({ message: "An error occurred on the server" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(Ok).json({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFound)
          .json({ message: "Requested resource not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequest)
          .json({ message: "Invalid request parameters" });
      }
      return res
        .status(internalserverError)
        .json({ message: "An error occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() =>
      res.status(Ok).json({ message: "Item has been successfully deleted" })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFound)
          .json({ message: "Requested resource not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequest)
          .json({ message: "Invalid request parameters" });
      }

      return res
        .status(internalserverError)
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
          .status(notFound)
          .json({ message: "Requested resource not found" });
      }
      return res.json({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(internalserverError)
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
          .status(notFound)
          .json({ message: "Requested resource not found" });
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(internalserverError)
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
