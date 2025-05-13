const mongoose = require('mongoose');
let Schema = mongoose.Schema

const slideImg = new Schema({
    images: [{
        type: String 
      }],
})

module.exports = mongoose.model('sliderImage', slideImg);