import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import mongoose from 'mongoose';

// Extend Express Request to include user property
declare global {
    namespace Express {
        interface Request {
            user?: { 
                _id?: mongoose.Types.ObjectId;
                email?: string;
                token?: string;
            };
        }
    }
}

// Define JWT payload interface
interface JwtPayload {
    _id: string;
}

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('Cookie received:', req.cookies);
    const token = req.cookies.token;

    if (!token) {
        console.log('No token found in cookies');
        res.status(401).json({ error: 'Authorization token required' });
        return;
    }

    try {
        console.log('Attempting to verify token');
        // Check if secret is defined
        const secret = process.env.SECRET;
        if (!secret) {
            throw new Error('JWT secret key is not defined');
        }

        // Verify and decode the JWT token
        const decoded = jwt.verify(token, secret) as JwtPayload;
        console.log('Token verified, user id:', decoded._id);
        
        const user = await User.findOne({ _id: decoded._id }).select('_id');
        if (!user) {
            console.log('User not found for id:', decoded._id);
            res.status(401).json({ error: 'User not found' });
            return;
        }
        
        req.user = user;
        console.log('User authenticated:', decoded._id);
        next();
    } catch (error) {
        console.log('Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
        res.status(401).json({ error: 'Request is not authorized' });
    }
};
 
export default requireAuth;