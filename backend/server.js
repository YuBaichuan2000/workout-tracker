import express from 'express';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workouts';

dotenv.config();

const app = express();

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.use(workoutRoutes);

app.get('/', (req, res) => {
    res.json({msg: "welcome to the app"});
});


app.listen(process.env.PORT || 4000, ( req, res )=> {
    console.log("app is listening on port 4000");
});