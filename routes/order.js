const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

// Create a new order
router.post("/create-order", orderController.createOrder);

// Capture a PayPal order
router.post("/capture-order", orderController.captureOrder);

// Get order details by PayPal order ID
router.get("/order/:orderID", orderController.getOrderDetails);

// Optional: Get all orders (for admin/seller)
router.get("/all-orders", orderController.getAllOrders);

module.exports = router;
