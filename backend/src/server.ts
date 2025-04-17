import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workouts.js';
import userRoutes from './routes/users.js';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://workout-tracker-frontend-1gjy.onrender.com',
    credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI || '')
    .then(() => {
        const port: number = parseInt(process.env.PORT || '4000', 10);
        app.listen(port, () => {
            console.log(`Connected to db and app is listening on port ${port}`);
        });
    })
    .catch((error: Error) => {
        console.error('MongoDB connection error:', error);
    }); 
