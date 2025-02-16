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

export default passport.use(new GoogleStrategy({
    // options for strategy
    callbackURL: 'http://localhost:4000/api/users/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    // check if user already exist
    const currUser = await User.findOne({googleId: profile.id})

    if (currUser) {
        
        // create token
        const token = createToken(currUser._id);
    

        done(null, {email: currUser.email, token});
    } else {
        const newUser = new User({email: profile.emails[0].value, googleId: profile.id});
        await newUser.save();

        const token = createToken(newUser._id);

        done(null,{email: newUser.email, token});
    }
}));


