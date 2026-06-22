const ClothingItem = require('../models/clothingItem')
const { internalserverError, Ok, noContent }= require('../utils/errors')

const createItem = (req, res) => {
  console.log(req)
  console.log(req.body)

  const {name, weather, imageURL} = req.body;

  ClothingItem.create({name,weather, imageURL}).then((item) => {
    console.log(item)
    res.send({data:item})
  }).catch((e) => {
    res.status(internalserverError).send({message: 'Error from createItem', e})
  });
}

  const getItems = (req, res) => {
    ClothingItem.find({}).then((items) => res.status(Ok).send(items))
    .catch((e) => {
      res.status(internalserverError).send({message: "Error from getItems", e})
    })
  }

  const updateItem = (req, res) => {
    const {itemId} = req.params;
    const {imageURL} = req.body;

    ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data:item}))
    .catch((e) => {
      res.status(internalserverError).send({message: "Error from updateItem", e})})
  }

  const deleteItem = (req, res) => {
    const { itemId } = req.params;

    console.log(itemId);
    ClothingItem.findByIdAndDelete(itemId).orFail().then(() => res.status(noContent).send({}))
    .catch((e) => {
      res.status(internalserverError).send({message: "Error from deleteItem", e})})
  }

  module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem,
  }
