import { Request, Response } from 'express';
import User, { IUser } from '../models/userModels.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../config/emails.js';

dotenv.config();

interface CustomRequest extends Request {
    body: {
        email: string;
        password: string;
        verificationToken?: string;
    };
    params: {
        token?: string;
    };
}

const createToken = (_id: string): string => {
    return jwt.sign({ _id }, process.env.SECRET || '', { expiresIn: '1d' });
};

export const loginUser = async (req: CustomRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id.toString());

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ email });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const signupUser = async (req: CustomRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);
        const token = createToken(user._id.toString());

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        await sendVerificationEmail(user.email, user.verificationToken || '');
        res.status(200).json({ msg: 'User created and verification email sent' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const verifyEmail = async (req: CustomRequest, res: Response): Promise<void> => {
    const { verificationToken } = req.body;

    try {
        const user = await User.findOne({
            verificationToken,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({ error: 'Invalid or expired token' });
            return;
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email);
        res.status(200).json({ msg: 'User completed verification' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const forgotPassword = async (req: CustomRequest, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = new Date(resetTokenExpiresAt);
        await user.save();

        const baseUrl = process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://workout-tracker-frontend-1gjy.onrender.com";

        await sendPasswordResetEmail(user.email, `${baseUrl}/reset-password/${resetToken}`);
        res.status(200).json({ msg: 'User wait for reset link' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const resetPassword = async (req: CustomRequest, res: Response): Promise<void> => {
    const { token } = req.params || {};
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({ error: 'Invalid or expired token' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();
        await sendPasswordResetSuccessEmail(user.email);
        res.status(200).json({ email: user.email });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const logoutUser = async (_req: CustomRequest, res: Response): Promise<void> => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(200).json({ msg: 'Logout successful' });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};