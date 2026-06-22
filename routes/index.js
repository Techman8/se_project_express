const router = require("express").Router();
const clothingItem = require('./clothingItem')
const userRouter = require("./users");
const notFound = require('../utils/errors')

router.use("/users", userRouter);
router.use('/items', clothingItem);

router.use((req, res) => {
  res.status(notFound).send({message: 'Requested resource not found'});
})

module.exports = router;