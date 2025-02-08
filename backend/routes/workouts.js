import express from 'express';
import { createWorkout, getSingleWorkout, getWorkouts }  from '../controllers/workoutController.js';


const router = express.Router();

router.get('/', getWorkouts);

router.get('/:id', getSingleWorkout);

router.post('/', createWorkout);

router.delete('/:id', (req, res) => {
    res.json({msg: 'DELETE a workout'});
});

router.patch('/:id', (req, res) => {
    res.json({msg: 'UPDATE a workout'});
});


export default router;