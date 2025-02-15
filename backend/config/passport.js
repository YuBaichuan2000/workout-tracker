import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();

export default passport.use(new GoogleStrategy({
    // options for strategy
    callbackURL: 'api/users/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, () => {
    // passport callback function
}));


