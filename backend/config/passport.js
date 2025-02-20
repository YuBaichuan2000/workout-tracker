import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/userModels.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '1d' });
};

// passport.serializeUser((user, done) => {
//     done(null, user._id);
// });

// passport.deserializeUser(async (_id, done) => {
//     const user = await User.findById(_id);
//     if (user) {
//         done(null, user);
//     }
// })

export default passport.use(
    new GoogleStrategy(
      {
        // options for strategy
        callbackURL:
          process.env.NODE_ENV === "development"
            ? "http://localhost:4000/api/users/google/redirect"
            : "https://workout-tracker-f15p.onrender.com/api/users/google/redirect",
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if a user already exists with the Google ID
          let user = await User.findOne({ googleId: profile.id });
  
          // If not, check if a user exists with the same email
          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              // If found, update the user's googleId field (merging accounts)
              if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
              }
            }
          }
  
          // If user exists (either found by googleId or updated by email), log them in
          if (user) {
            const token = createToken(user._id);
            return done(null, { email: user.email, token });
          }
  
          // Otherwise, create a new user with Google credentials
          const newUser = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await newUser.save();
          const token = createToken(newUser._id);
          return done(null, { email: newUser.email, token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  