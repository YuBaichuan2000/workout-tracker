import Workout from '../models/workoutModels.js';
import mongoose from 'mongoose';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const workout = z.object({
    title: z.string().describe("The exercise title"),
    load: z.number().describe("The load in kg for the workout"),
    reps: z.number().describe("The number of repetitions"),
});


// New controller function for AI-suggested workout
export const suggestWorkout = async (req, res) => {

    try {
        // Retrieve the user's workout history from the database
        const user_id = req.user._id;
        const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
        
        // Build a string summary of the workout history
        let historyText = '';
        if (workouts && workouts.length > 0) {
            workouts.forEach((workout, idx) => {
                historyText += `${idx + 1}. Title: ${workout.title}, Load: ${workout.load} kg, Reps: ${workout.reps}\n`;
        });
        } else {
            historyText = "No previous workout data available.";
        }

        const model = new ChatOpenAI({model: "gpt-4o"});
        
        // Bind the schema to the model
        const structuredLlm = model.withStructuredOutput(workout);
        
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional fitness trainer and you need to generate a new workout suggestion based on the following workout history from a user. You should be suggesting workouts that suit user capability and help users improve steadily"],
            ["user", "{history}"]
        ]);

        const prompt1 = await prompt.invoke({ history: historyText });
        
        const result = await structuredLlm.invoke(prompt1);
        
        // Return the structured suggestion as JSON
        res.status(200).json(result);
    } catch (error) {
        console.error("Error generating workout suggestion:", error);
        res.status(500).json({ error: 'Server error generating suggestion.' });
    }
};

export const getWorkouts = async (req, res) => {
    try {

        const user_id = req.user._id

        const workouts = await Workout.find({ user_id }).sort({createdAt: -1})

        res.status(200).json(workouts);
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

        let empty = []
        if (!title) {
            empty.push('title');
        };
        if (!load) {
            empty.push('load');
        };
        if (!reps) {
            empty.push('reps');
        };
        if (empty.length > 0){
            return res.status(400).json({error: 'Please fill in all fields', empty});
        }

        const user_id = req.user._id;

        const workout = await Workout.create({title, reps, load, user_id});
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
        const {title, reps, load} = req.body;

        let empty = []
        if (!title) {
            empty.push('title');
        };
        if (!load) {
            empty.push('load');
        };
        if (!reps) {
            empty.push('reps');
        };
        if (empty.length > 0){
            return res.status(400).json({error: 'Please fill in all fields', empty});
        }

        // check if object id is valid
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No such workout'});
        }

        const workout = await Workout.findOneAndUpdate({_id: id}, {
            ...req.body
        }, { new: true })

        if (!workout) {
            return res.status(404).json({error: 'No such workout'});
        }

        res.status(200).json(workout);
    } catch (e) {
        res.status(400).json({error: e.message});
    };

};
