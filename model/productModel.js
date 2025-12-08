const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    "10k_yellow_gold": { type: Number, required: false },
    "10k_rose_gold": { type: Number, required: false },
    "10k_white_gold": { type: Number, required: false },

    "14k_yellow_gold": { type: Number, required: false },
    "14k_rose_gold": { type: Number, required: false },
    "14k_white_gold": { type: Number, required: false },

    "18k_yellow_gold": { type: Number, required: false },
    "18k_rose_gold": { type: Number, required: false },
    "18k_white_gold": { type: Number, required: false },

    silver: { type: Number, required: false },
    platinum: { type: Number, required: false },
  },
  metal: {
    type: String,
    required: true,
  },
  diamond: {
    type: String,
  },
  weight: {
    type: String,
    required: true,
  },

  cut: {
    type: String,
    required: true,
  },

  images: [
    {
      type: String,
    },
  ],
 videos: [
  {
    url: { type: String },
    public_id: { type: String }
  }
]
,

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },

  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory",
    required: true,
  },

  clarity: {
    type: String,
    required: true,
  },
  color:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sidestone:{
    type:String,
  },
    draft: Boolean, // true for draft, false for published

});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
