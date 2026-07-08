const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const { OK, CREATED } = require("../utils/success");

// 1. CREATE USER CONTROLLER
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // 1. Catch missing passwords instantly before hashing
  if (!password) {
    return res.status(BAD_REQUEST).json({ message: "Password is required" });
  }

  return bcryptjs
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      // Required special case: Manual cleanup for fresh database writes
      const userResponse = user.toObject();
      delete userResponse.password;
      return res.status(CREATED).json(userResponse);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(CONFLICT).json({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid request parameters" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

// 2. LOGIN CONTROLLER
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(OK).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .json({ message: "Incorrect email or password" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

// 3. GET CURRENT USER CONTROLLER
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).json(user)) // Relies cleanly on schema select: false
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested user not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

// 4. UPDATE PROFILE CONTROLLER
const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((updatedUser) => res.status(OK).json(updatedUser)) // Relies cleanly on schema select: false
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Requested user not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid request parameters" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
