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
    if (!req.user) {
      return res.redirect("https://www.clairediamonds.com/login?error=NoUser");
    }

    const { id, displayName, emails, photos } = req.user;

    try {
      let user = await User.findOne({ email: emails[0].value });

      if (!user) {
        // If user doesn't exist, create a new one
        user = new User({
          googleId: id,
          name: displayName,
          email: emails[0].value,
          profilePicture: photos[0].value,
        });
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, 
      );

      // Redirect to frontend with token
      res.redirect(`https://www.clairediamonds.com?token=${token}`);
    } catch (error) {
      console.error("Error saving Google user:", error);
      res.redirect("https://www.clairediamonds.com");
    }
    res.redirect("https://www.clairediamonds.com");
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
