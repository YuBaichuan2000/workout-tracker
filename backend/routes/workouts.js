import express from 'express';
import { createWorkout, getSingleWorkout, getWorkouts, updateWorkout, deleteWorkout }  from '../controllers/workoutController.js';


const router = express.Router();

router.get('/', getWorkouts);

router.get('/:id', getSingleWorkout);

router.post('/', createWorkout);

router.delete('/:id', deleteWorkout);

router.patch('/:id', updateWorkout);


export default router;