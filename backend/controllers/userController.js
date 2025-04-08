import User from  '../models/userModels.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../config/emails.js';

dotenv.config();

const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '1d'});
}

// login user
export const loginUser = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        // create token
        const token = createToken(user._id);

        // set the token as http-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24*60*60*1000,
        })

        res.status(200).json({email});

    } catch (e) {
        res.status(400).json({error: e.message});
    }

};

// signup user
export const signupUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);

        // create token
        const token = createToken(user._id);

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24*60*60*1000,
        })
        
        await sendVerificationEmail(user.email, user.verificationToken);
    
        res.status(200).json({ msg: 'User created and verification email sent' }); // send email verification, and wait for verification

    } catch (e) {
        res.status(500).json({error: e.message});
    }

};

export const verifyEmail = async (req, res) => {
    const { verificationToken } = req.body;

    try {
        const user = await User.findOne({verificationToken: verificationToken, verificationTokenExpiresAt: {$gt: Date.now()}});

        if (!user) {
            return res.status(400).json({error: 'Invalid or expired token'});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email);

        res.status(200).json({ msg: 'User completed verification' });


    } catch (e) {
        res.status(500).json({error: e.message});
    }

}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error: 'User not found'});
        } 

        // generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 60*60*1000; // expires in 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        const baseUrl = process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://workout-tracker-frontend-1gjy.onrender.com";

        await sendPasswordResetEmail(user.email, `${baseUrl}/reset-password/${resetToken}`);

        res.status(200).json({msg: 'User wait for reset link' });

    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpiresAt: {$gt: Date.now()}});
        if (!user) {
            return res.status(400).json({error: 'Invalid or expired token'});
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword; 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        

        await user.save();

        await sendPasswordResetSuccessEmail(user.email);

        res.status(200).json({email: user.email});

    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

// logout user and clear cookie
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(200).json({msg: 'Logout sucessful'});
    } catch (e) {
        res.status(400).json({error: e.message});
    }
    
}
