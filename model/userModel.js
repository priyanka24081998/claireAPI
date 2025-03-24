const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, 
        trim: true,
        lowercase: true, 
        match: [/\S+@\S+\.\S+/, "Invalid email format"], 
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"], 
    },
},
)

module.exports = mongoose.model('user', userSchema)