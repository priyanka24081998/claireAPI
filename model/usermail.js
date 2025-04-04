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
    googleId: { type: String, unique: true, sparse: true }, // Google ID (optional)
    name: { type: String, },
   
    profilePicture: { type: String }, // Store Google profile picture
  
    otp: String,
  otpExpires: Date,
},
)   

module.exports = mongoose.model('usermail', userSchema)