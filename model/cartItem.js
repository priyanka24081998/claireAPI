const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  selectedMetal: { type: String, required: true }, // store selected metal
}, { timestamps: true });

module.exports = mongoose.model("CartItem", CartItemSchema);
