import Workout from '../models/workoutModels.js';
import mongoose from 'mongoose';


export const getWorkouts = async (req, res) => {
    try {
        const workout = await Workout.find({}).sort({createdAt: -1})

        res.status(200).json(workout);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const getSingleWorkout = async (req, res) => {
    try {
        const {id} = req.params;

        // check if object id is valid
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No such workout'});
        }
        
        const workout = await Workout.findById(id);

        if (!workout) {
            return res.status(404).json({error: 'No such workout'});
        }

        res.status(200).json(workout)

    } catch (e) {
        res.status(400).json(e.message);
    }
}


export const createWorkout = async (req, res) => {
    try {
        const {title, reps, load} = req.body;
        const workout = await Workout.create({title, reps, load});
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

export const deleteWorkout = async (req, res) => {
    try {
        const {id} = req.params;
        // check if object id is valid
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No such workout'});
        }

        const workout = await Workout.findOneAndDelete({_id: id});

        if (!workout) {
            return res.status(404).json({error: 'No such workout'});
        }

        res.status(200).json(workout)

    } catch (e) {
        res.status(400).json({error: e.message});
    };
};

export const updateWorkout = async (req, res) => {
    try {
        const {id} = req.params;

        // check if object id is valid
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No such workout'});
        }

        const workout = await Workout.findOneAndUpdate({_id: id}, {
            ...req.body
        })

        if (!workout) {
            return res.status(404).json({error: 'No such workout'});
        }

        res.status(200).json(workout);
    } catch (e) {
        res.status(400).json({error: e.message});
    };

};
