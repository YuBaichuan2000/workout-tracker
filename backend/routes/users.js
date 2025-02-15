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
    scope: ['profile']
}));

// callback route for google
router.get('/google/redirect', (req, res) => {
    res.status(200).json({msg: 'you reached callback URI'})
});

export default router;