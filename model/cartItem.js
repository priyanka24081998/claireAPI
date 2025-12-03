import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  selectedMetal: { type: String, required: true }, // store selected metal
}, { timestamps: true });

export default mongoose.model("CartItem", CartItemSchema);
