const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

router.post("/create-order", orderController.createOrder);
router.post("/capture-order", orderController.captureOrder);
router.get("/order/:orderID", orderController.getOrderDetails);

module.exports = router;
