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

        
            
            const existingUser = await User.findOne({ email: profile.emails[0].value });
          
            if (existingUser) {
              // Update that user to link Google account
              existingUser.googleId = profile.id;
              await existingUser.save();
              user = existingUser;
            } else {
              // Create new user
              user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
              });
            }
         
          

        // You can pass full info here for later use
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    console.log("🔐 Serializing user:", user);
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    console.log("🔓 Deserializing user by ID:", id);
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
