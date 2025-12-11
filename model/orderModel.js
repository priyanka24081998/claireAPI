const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  metal: { type: String, required: true },
  size: { type: String, required: true },
});

const ShippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [ProductSchema],
  total: { type: Number, required: true },
  shipping: ShippingSchema,
  paypalOrderId: { type: String },
  paypalStatus: { type: String, default: "CREATED" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
