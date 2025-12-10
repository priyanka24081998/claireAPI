const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
