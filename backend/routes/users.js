import express from 'express';
import passport from 'passport';
import { loginUser, signupUser } from '../controllers/userController.js';
import passportSetup from '../config/passport.js';

const router = express.Router();

// login
router.post('/login', loginUser);

// signup
router.post('/signup', signupUser);

// auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// callback route for google
router.get('/google/redirect', passport.authenticate('google', {session: false}), (req, res) => {
    const {email, token} = req.user;
    res.redirect(`http://localhost:3000/auth/google?token=${token}&email=${email}`);
});

export default router;