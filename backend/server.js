import express from 'express';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workouts.js';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://workout-tracker-frontend-1gjy.onrender.com'
  }));

app.use(express.json());

app.use('/api/workouts', workoutRoutes);

// app.use((req, res, next) => {
//     console.log(req.path, req.method);
//     next();
// })

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT || 4000, ( req, res )=> {
        console.log("connected to db and app is listening on port ", process.env.PORT);
    });
})
.catch((e) => {
    console.log(e);
});



