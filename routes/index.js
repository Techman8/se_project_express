const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const authorize = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItem");
const { NOT_FOUND } = require("../utils/errors");

// ==========================================
// 1. PUBLIC LOBBY (No token needed)
// ==========================================
router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

// ==========================================
// 2. THE SECURITY GATE
// ==========================================
router.use(authorize);

// ==========================================
// 3. SECURED ZONES (Token strictly required)
// ==========================================
router.use("/users", userRouter);
router.use("/items", clothingItem);

// Catch-all handler for unknown pages
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
