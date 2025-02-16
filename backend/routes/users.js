import express from 'express';
import passport from 'passport';
import { loginUser, signupUser, logoutUser } from '../controllers/userController.js';
import passportSetup from '../config/passport.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const router = express.Router();

// login
router.post('/login', loginUser);

// signup
router.post('/signup', signupUser);

// logout
router.post('/logout', logoutUser);

// auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// callback route for google
router.get('/google/redirect', passport.authenticate('google', {session: false}), (req, res) => {
    const {email, token} = req.user;

    res.cookie('token', token, {
        httpOnly: true, // not accessible to client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // use HTTPS in production
        sameSite: 'strict', // helps mitigate CSRF attacks
        maxAge: 24 * 60 * 60 * 1000 // cookie expires in 1 day
    });
    
    const redirectUrl = process.env.NODE_ENV === 'development' ?  `http://localhost:3000/auth/google?email=${email}` : `https://workout-tracker-f15p.onrender.com/auth/google?email=${email}`
    res.redirect(redirectUrl);
});

export default router;