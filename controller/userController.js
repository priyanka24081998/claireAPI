const User = require("../model/userModel");
const UserMail = require("../model/usermail"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config(); 

// ✅ Secure & Correct SMTP Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  // host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ Send OTP
exports.sendOtp = async (req, res) => {
 
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await UserMail.findOne({ email });
  
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP in database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via Email
    const mailOptions = {
      from: `"Claire Diamonds" <${process.env.EMAIL}>`,
      to: email,
      subject: "🔒 Secure OTP Code for Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1); text-align: center;">
          <img src="https://www.clairediamonds.com/_next/image?url=%2Fassets%2Flogo2.png&w=3840&q=75" alt="Claire Diamonds" style="width: 150px;height:100px; margin-bottom: 20px;">
          <h2 style="color: #333;">🔐 Your OTP Code</h2>
          <p style="font-size: 18px; color: #555;">Use the OTP below to verify your identity. It is valid for <b>10 minutes</b>.</p>
          <p style="font-size: 24px; font-weight: bold; color: #d9534f; background: #f8f9fa; padding: 10px; border-radius: 5px; display: inline-block; letter-spacing: 2px;">${otp}</p>
          <p style="color: #777; font-size: 14px; margin-top: 15px;">If you did not request this, please ignore this email.</p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Claire Diamonds &copy; ${new Date().getFullYear()} | All Rights Reserved</p>
        </div>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email sending failed:", error);
      } else {
        console.log("✅ Email sent successfully:", info);
      }
    });
 
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body; // Get the email and OTP from the request body

    // Find the user by email
    const user = await UserMail.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("Stored OTP:", user.otp);
    console.log("Stored Expiry:", user.otpExpires);
    console.log("Current Time:", new Date());

    // Ensure `otpExpires` is a Date object
    const expiryTime = new Date(user.otpExpires);

    // Check if OTP exists and verify if it's expired
    if (!user.otp || expiryTime < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, proceed to the next middleware (registerUser controller)
    res.status(201).json({
      message: "User verified successfully!",
      data: {email: user.email},
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ User Registration
exports.registerUser = async (req, res) => {
  try {
    const { name, lastname, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, lastname, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully!",
      data: { name: newUser.name, lastname: newUser.lastname },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserMail.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.emailId.email }, process.env.JWT_SECRET,);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await UserMail.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Update the OTP in the user document
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the new OTP to the user's email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your new OTP code is: ${otp}`,
    });

    res.json({ message: "OTP has been resent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId; // Extracted from JWT in middleware

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("emailId","email").select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get User By ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("emailId","email").select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
