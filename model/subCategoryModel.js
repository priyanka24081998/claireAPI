const mongoose = require('mongoose');
let Schema = mongoose.Schema;
 
const subCategorySchema = new Schema({
    subCategoryName:{
        type: String,
        required : true
    },
    categoryId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'category', 
       required: true

     },
})

module.exports = mongoose.model('subCategory',subCategorySchema)