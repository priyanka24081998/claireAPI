require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/usermail"); 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://claireapi.onrender.com/auth/google/callback", // Ensure this matches the redirect URI in Google Developer Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        } // console.log("Google profile: ", profile);
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;
        const name = profile.displayName;

        // You can pass full info here for later use
        done(null, {
          googleId: profile.id,
          name,
          email,
          profilePicture: photo,
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
