const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryName :{
        type :String,
        required : true,
    },
})
module.exports = mongoose.model('category',categorySchema)