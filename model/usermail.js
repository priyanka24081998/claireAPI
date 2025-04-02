const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new Schema({

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, 
        trim: true,
        lowercase: true, 
        match: [/\S+@\S+\.\S+/, "Invalid email format"], 
    },
    otp: String,
  otpExpires: Date,
},
)

module.exports = mongoose.model('usermail', userSchema)