const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect(
    "mongodb+srv://CLUX:horntail99@cluster0.aubpkzn.mongodb.net/?appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
