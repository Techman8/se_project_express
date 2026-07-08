const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Define the custom static method for authentication
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  // 1. Find the user by email and explicitly select the hidden password field
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      // 2. If no user is found, reject the promise chain with a clear message
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      // 3. Use bcryptjs to compare the plain password with the stored hash
      return bcrypt.compare(password, user.password).then((matched) => {
        // 4. If the passwords match, return the user object
        if (matched) {
          return user;
        }

        // 5. If passwords do not match, reject the promise chain
        return Promise.reject(new Error("Incorrect email or password"));
      });
    });
};

module.exports = mongoose.model("user", userSchema);
