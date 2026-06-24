
const User = require("../models/user");
const { badRequest, notFound, internalserverError, Ok, Created, } = require('../utils/errors');


const getUsers = (req, res) => {
  User.find({})
  .then((users) => res.status(Ok).send(users))
  .catch((err) => {
    console.error(err);
    return res.status(internalserverError).send({ message: 'An error occurred on the server'})
  })
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create ({ name, avatar })
  .then((user) => res.status(Created).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(badRequest).send({ message: 'Invalid request parameters'});
    }
    return res.status(internalserverError).send({ message: 'An error occurred on the server'});
  });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail()
  .then((user) => res.status(Ok).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(notFound).send({ message: 'Requested resource not found'})
    } if (err.name === "CastError") {
      return res.status(badRequest).send({ message: 'Invalid request parameters'})
    }
    return res.status(internalserverError).send({ message:'An error occurred on the server'})
});
};

module.exports = { getUsers, createUser, getUser };