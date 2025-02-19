import express from 'express';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workouts.js';
import userRoutes from './routes/users.js';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use(cors({
    origin: process.env.NODE_ENV === 'development' ?  'http://localhost:3000' : 'https://workout-tracker-frontend-1gjy.onrender.com',
    credentials: true
}));


// app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT || 4000, ( req, res )=> {
        console.log("connected to db and app is listening on port ", process.env.PORT);
    });
})
.catch((e) => {
    console.log(e);
});



