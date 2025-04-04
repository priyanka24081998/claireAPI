const express = require("express");
const passport = require("passport");

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
  (req, res) => {
    res.redirect("https://www.clairediamonds.com"); // Redirect to frontend after login
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("https://www.clairediamonds.com/login");
  });
});

module.exports = router;
