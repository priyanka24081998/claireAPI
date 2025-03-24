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
    enum: ['Gold', 'Silver', 'White Gold', 'Rose Gold'],
    required: true
  },
  diamond :{
    type: String,
    enum :['Lab Diamond', 'Mossanite','Gemstone']
  },
  weight: {
    type: String, 
    required: true
  },

  cut: {
    type:String,
    required:true
  },

  images: [{
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
    enum: [
      'FL', 
      'IF', 
      'VVS1', 'VVS2',
      'VS1', 'VS2',    
      'SI1', 'SI2',  
      'I1', 'I2', 'I3' 
    ],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});  

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
