import express from 'express';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workouts.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.use('/api/workouts', workoutRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT || 4000, ( req, res )=> {
        console.log("connected to db and app is listening on port ", process.env.PORT);
    });
})
.catch((e) => {
    console.log(e);
});

app.get('/', (req, res) => {
    res.json({msg: "welcome to the app"});
});


