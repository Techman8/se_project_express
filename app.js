const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index"); // Explicit extension for Airbnb linting

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// 1. Parse incoming JSON payloads
app.use(express.json());

// 2. Route directly to the master router (where public vs protected is sorted out)
app.use("/", mainRouter);

// 3. Start the server
app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
