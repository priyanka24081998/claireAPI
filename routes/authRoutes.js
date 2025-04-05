const express = require("express");
const passport = require("passport");
const User = require("../model/usermail"); // Import User model
const jwt = require("jsonwebtoken");
const router = express.Router();

// Google OAuth login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
      try {
        const { googleId, name, email, profilePicture } = req.user;
  
        if (!email) {
          return res.redirect("https://www.clairediamonds.com/login?error=NoEmail");
        }
  
        let user = await User.findOne({ email });
        const isNewUser = !user;
  
        if (isNewUser) {
          user = new User({ googleId, name, email, profilePicture });
          await user.save();
        }
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
  
        let redirectUrl = `https://www.clairediamonds.com/signup?token=${token}`;
        if (isNewUser) {
          redirectUrl += `&newUser=true&email=${encodeURIComponent(email)}`;
        }
  
        return res.redirect(redirectUrl);
      } catch (error) {
        console.error("Error saving Google user:", error);
        return res.redirect("https://www.clairediamonds.com/login?error=ServerError");
      }
    }
  );

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("https://www.clairediamonds.com");
  });
});

module.exports = router;
