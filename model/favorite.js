import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Favorite", FavoriteSchema);
