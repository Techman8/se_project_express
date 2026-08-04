const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");
const { OK, CREATED } = require("../utils/success");

// 1. CREATE USER CONTROLLER
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Catch missing passwords instantly before hashing
  if (!password) {
    return next(new BadRequestError("Password is required"));
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
      if (err.code === 11000) {
        next(new ConflictError("Email already exists"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid request parameters"));
      } else {
        next(err);
      }
    });
};

// 2. LOGIN CONTROLLER
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(OK).json({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

// 3. GET CURRENT USER CONTROLLER
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).json(user)) // Relies cleanly on schema select: false
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested user not found"));
      } else {
        next(err);
      }
    });
};

// 4. UPDATE PROFILE CONTROLLER
const updateProfile = (req, res, next) => {
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
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested user not found"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid request parameters"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };