import express, { Express, Request, Response } from 'express';
import passport from 'passport';
import { loginUser, signupUser, logoutUser, verifyEmail, forgotPassword, resetPassword } from '../controllers/userController.js';
import passportSetup from '../config/passport.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// login
router.post('/login', loginUser);

// signup
router.post('/signup', signupUser);

// logout
router.post('/logout', logoutUser);

// verify token
router.post('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

// auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// callback route for google
router.get('/google/redirect', passport.authenticate('google', { session: false }), (req: Request , res: Response) => {
    const { email, token } = req.user as { email: string; token: string };

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    });
    
    const redirectUrl = process.env.NODE_ENV === 'development' 
        ? `http://localhost:3000/auth/google?email=${email}` 
        : `https://workout-tracker-frontend-1gjy.onrender.com/auth/google?email=${email}`;
    
    res.redirect(redirectUrl);
});

export default router;