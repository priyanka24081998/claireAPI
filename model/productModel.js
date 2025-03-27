const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  metal: {
    type: String,
    
    required: true
  },
  diamond :{
    type: String,
    
  },
  weight: {
    type: String, 
    required: true
  },

  cut: {
    type:String,
    required:true
  },

  imageUrl: [{
    type: String 
  }],
  videos: [{
    type: String 
  }],
   
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category', 
    required: true
  },
  
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subCategory', 
    required: true
  },

  clarity: {
    type: String,
   
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});  

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
