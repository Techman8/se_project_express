const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: "6a3b4cfb3fbcb98fc0d72fb0" };
  next();
});
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
