import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/userModels.js';
import dotenv from 'dotenv';
dotenv.config();

export default passport.use(new GoogleStrategy({
    // options for strategy
    callbackURL: 'http://localhost:4000/api/users/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // check if user already exist
    const currUser = await User.findOne({googleId: profile.id})

    if (currUser) {
        console.log('User is: ', currUser);
    } else {
        const newUser = new User({email: profile.emails[0].value, googleId: profile.id});
        await newUser.save();
        console.log(newUser);
    }
}));


