const express = require("express");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index"); // Explicit extension for Airbnb linting

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// 1. Parse incoming JSON payloads
app.use(express.json());

// 2. Request logger MUST be attached before all routes
app.use(requestLogger);

// 2. Route directly to the master router (where public vs protected is sorted out)
app.use("/", mainRouter);

// 3. Error logger MUST be attached after routes, but before error handlers
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

// Database Connection & Server Activation Sequence
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server successfully started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
