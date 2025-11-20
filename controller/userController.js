const User = require("../model/userModel");
const UserMail = require("../model/usermail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const mongoose = require("mongoose");

require("dotenv").config();

// ✅ Secure & Correct SMTP Config
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // IMPORTANT
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD, // app password only!
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // must be false for Brevo
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});
// Verify SMTP (optional but useful)
transporter.verify((err, success) => {
  if (err) {
    console.log("SMTP Connection Error:", err);
  } else {
    console.log("SMTP Ready:", success);
  }
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
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, proceed to the next middleware (registerUser controller)
    res.status(201).json({
      message: "User verified successfully!",
      data: { email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ User Registration
exports.registerUser = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    // Find the email document in `usermail` collection
    const userMail = await UserMail.findOne({ email });

    if (!userMail) {
      return res
        .status(400)
        .json({ error: "Email not found. Please verify your email first." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with the correct `emailId`
    const newUser = await User.create({
      name,
      lastname,
      emailId: userMail._id, // Assign the ObjectId of usermail
      password: hashedPassword,
    });

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

    // Step 1: Find email in UserMail
    const userMail = await UserMail.findOne({ email: email });
    console.log(userMail);
    if (!userMail) return res.status(400).json({ message: "Invalid email" });

    console.log("UserMail Found:", userMail);
    console.log("Searching User by _id:", userMail._id);

    // Step 2: Find corresponding user in User collection
    console.log("Searching for User with emailId._id:", userMail._id);
    const user = await User.findOne({ emailId: userMail._id });

    if (!user) {
      console.log("User not found, trying alternative search...");
      user = await User.findOne({ "emailId.email": userMail.email });
    }

    console.log("User Found:", user);

    if (!user) return res.status(400).json({ message: "Invalid email id" });

    // Step 3: Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Step 4: Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: email },
      process.env.JWT_SECRET
    );

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
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

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
    const users = await User.find()
      .populate("emailId", "email")
      .select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get User By ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("emailId", "email")
      .select("-password");
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

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if email exists
//     const user = await UserMail.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     // Generate OTP
//     const otp = crypto.randomInt(100000, 999999).toString();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

//     // Save OTP in the database
//     user.otp = otp;
//     user.otpExpires = otpExpires;
//     await user.save();
//     console.log("OTP saved successfully. Proceeding to email..."); // <-- Check logs for this!

//     // Send OTP via Email
//     const mailOptions = {
//       from: `"Claire Diamonds" <${process.env.EMAIL}>`,
//       to: email,
//       subject: "🔒 Password Reset OTP",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
//           <h2 style="color: #333;">🔐 Reset Your Password</h2>
//           <p style="font-size: 18px; color: #555;">Use the OTP below to reset your password. It is valid for <b>10 minutes</b>.</p>
//           <p style="font-size: 24px; font-weight: bold; color: #d9534f; background: #f8f9fa; padding: 10px; border-radius: 5px; display: inline-block; letter-spacing: 2px;">${otp}</p>
//           <p style="color: #777; font-size: 14px; margin-top: 15px;">If you did not request this, please ignore this email.</p>
//         </div>
//       `,
//     };
//     console.log("Sending mail to:", email, "from:", process.env.EMAIL); // <-- Check logs for this!
//     await transporter.sendMail(mailOptions);

//     res.json({ message: "OTP sent for password reset!" });
//   } catch (error) {
//     console.error("Critical Forgot Password Error:", error); // <-- Check logs for this!
//     res.status(500).json({ error: error.message });
//   }
// };

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists
    const user = await UserMail.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log("OTP saved:", otp);

    // Email Template
    const mailOptions = {
      from: `"Claire Diamonds" <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: "🔒 Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
          <h2 style="color: #333;">🔐 Reset Your Password</h2>
          <p style="font-size: 18px; color: #555;">Use the OTP below to reset your password. It is valid for <b>10 minutes</b>.</p>
          <p style="font-size: 24px; font-weight: bold; color: #d9534f; background: #f8f9fa; padding: 10px; border-radius: 5px; display: inline-block; letter-spacing: 2px;">${otp}</p>
          <p style="color: #777; font-size: 14px; margin-top: 15px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully via Brevo!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: error.message });
  }
};




// ✅ Verify OTP for Password Reset
exports.verifyOtpForReset = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user in UserMail collection
    const user = await UserMail.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check OTP validity
    if (!user.otp || user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user in UserMail collection
    const userMail = await UserMail.findOne({ email });
    if (!userMail) return res.status(404).json({ message: "User not found" });

    // Find user in User collection using emailId
    const user = await User.findOne({ emailId: userMail._id });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found in main database" });

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
