var express = require("express");
var router = express.Router();
const { addToCart, getCart, removeFromCart } = require("../controller/cartController");

router.post("/", addToCart);
router.get("/:userId", getCart);
router.delete("/", removeFromCart);

module.exports = router;
