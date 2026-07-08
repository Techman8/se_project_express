const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index"); // Explicit extension for Airbnb linting

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// 1. Parse incoming JSON payloads
app.use(express.json());

// 2. Route directly to the master router (where public vs protected is sorted out)
app.use("/", mainRouter);

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
