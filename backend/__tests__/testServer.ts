import express, { Express } from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import workoutRoutes from '../src/routes/workouts';
import userRoutes from '../src/routes/users';
import dotenv from 'dotenv';

dotenv.config();

// Create a dedicated test Express app
export const createTestApp = (): Express => {
  const app = express();
  
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  
  app.use(express.json());
  app.use(passport.initialize());
  app.use(cookieParser());
  
  app.use('/api/workouts', workoutRoutes);
  app.use('/api/users', userRoutes);
  
  return app;
};

const testApp = createTestApp();
export default testApp;