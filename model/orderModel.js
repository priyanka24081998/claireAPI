const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const orderSchema = new Schema({
  paypalOrderID: String,
  products: [
    {
      productId: String,
      name: String,
      metal: String,
      size: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  status: { type: String, default: "CREATED" }, // CREATED, APPROVED, CAPTURED
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
