import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: String,   // or ObjectId — whichever you use
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",   // 👈 VERY IMPORTANT
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("Favorite", FavoriteSchema);
