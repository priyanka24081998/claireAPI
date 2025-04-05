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
  passport.authenticate("google", { failureRedirect: "https://www.clairediamonds.com/login" }),
  async (req, res) => {
    if (!req.user) {
      return res.redirect("https://www.clairediamonds.com/login?error=NoUser");
    }

    const { id, displayName, emails, photos } = req.user;

    try {
      let user = await User.findOne({ email: emails[0].value });
      const isNewUser = !user;

      if (isNewUser) {
        // Create new user
        user = new User({
          googleId: id,
          name: displayName,
          email: emails[0].value,
          profilePicture: photos[0].value,
        });
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d", // optional: expires in 7 days
      });

      // Build redirect URL
      let redirectUrl = `https://www.clairediamonds.com/signup?token=${token}`;

      if (isNewUser) {
        // Add newUser flag and email for frontend redirect logic
        redirectUrl += `&newUser=true&email=${encodeURIComponent(user.email)}`;
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
