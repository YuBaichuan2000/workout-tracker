import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModels.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Check for required environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const secret = process.env.SECRET;

if (!clientId || !clientSecret || !secret) {
  throw new Error('Missing required environment variables for Google OAuth');
}

// Define return type for createToken
const createToken = (_id: string): string => {
  return jwt.sign({ _id }, secret, { expiresIn: '1d' });
};

// Export the Google strategy
export default passport.use(
  new GoogleStrategy(
    {
      // options for strategy
      callbackURL:
        process.env.NODE_ENV === "development"
          ? "http://localhost:4000/api/users/google/redirect"
          : "https://workout-tracker-f15p.onrender.com/api/users/google/redirect",
      clientID: clientId,
      clientSecret: clientSecret,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Check if a user already exists with the Google ID
        let user = await User.findOne({ googleId: profile.id });

        // If not, check if a user exists with the same email
        if (!user && profile.emails && profile.emails.length > 0) {
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
          const token = createToken(user._id.toString());
          return done(null, { email: user.email, token });
        }

        // Otherwise, create a new user with Google credentials
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        const newUser = await User.create({
          email: profile.emails[0].value,
          googleId: profile.id,
          isVerified: true
        });

        const token = createToken(newUser._id.toString());
        return done(null, { email: newUser.email, token });
      } catch (err) {
        return done(err instanceof Error ? err : new Error('Unknown error'), undefined);
      }
    }
  )
);