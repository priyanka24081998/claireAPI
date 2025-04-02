const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required:true,
    },
    lastname: {
        type: String,
        trim: true,
        required:true,
    },
    emailId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'usermail', 
        required: true
       
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"], 
    },
   
},
)

module.exports = mongoose.model('user', userSchema)