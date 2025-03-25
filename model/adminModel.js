const mongoose = require('mongoose')
let Schema = mongoose.Schema

const adminSchema = new Schema({
    email :{
        type :String,
        required : true
        
    },
    password :{
        type :String,
        required : true,
        unique: true,  
        trim: true    

    }
})
module.exports = mongoose.model('admin',adminSchema)