const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../model/usermail");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account consent"
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "https://www.clairediamonds.com/login?error=OAuthFailed" }),
  async (req, res) => {
    if (!req.user) {
      return res.redirect("https://www.clairediamonds.com/login?error=NoUser");
    }

    const { _id, email, name } = req.user;

    const token = jwt.sign({ userId: _id, email, name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Use state parameter from Google OAuth
    const redirectUrl = req.query.state ? decodeURIComponent(req.query.state) : "https://www.clairediamonds.com";

    // Append token
    const finalUrl = `${redirectUrl}${redirectUrl.includes("?") ? "&" : "?"}token=${token}`;

    return res.redirect(finalUrl);
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.redirect("https://www.clairediamonds.com");
  });
});

module.exports = router;
