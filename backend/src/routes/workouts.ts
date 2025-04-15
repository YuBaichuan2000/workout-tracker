import express from 'express';
import { createWorkout, getSingleWorkout, getWorkouts, updateWorkout, deleteWorkout, suggestWorkout  }  from '../controllers/workoutController.js';
import requireAuth from '../middleware/requireAuth.js';


const router = express.Router();

router.use(requireAuth);

router.get('/', getWorkouts);

router.get('/suggest', suggestWorkout); 

router.get('/:id', getSingleWorkout);

router.post('/', createWorkout);

router.delete('/:id', deleteWorkout);

router.patch('/:id', updateWorkout);


export default router;