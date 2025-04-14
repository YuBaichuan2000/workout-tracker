import { Request, Response } from 'express';
import Workout, { IWorkout } from '../models/workoutModels.js';
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

interface CustomRequest extends Request {
    user?: {
        _id: mongoose.Types.ObjectId;
    };
}

// New controller function for AI-suggested workout
export const suggestWorkout = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const user_id = req.user._id;
        const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
        
        let historyText = '';
        if (workouts && workouts.length > 0) {
            workouts.forEach((workout, idx) => {
                historyText += `${idx + 1}. Title: ${workout.title}, Load: ${workout.load} kg, Reps: ${workout.reps}\n`;
            });
        } else {
            historyText = "No previous workout data available.";
        }

        const model = new ChatOpenAI({ model: "gpt-4" });
        const structuredLlm = model.withStructuredOutput(workout);
        
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional fitness trainer and you need to generate a new workout suggestion based on the following workout history from a user. You should be suggesting workouts that suit user capability and help users improve steadily"],
            ["user", "{history}"]
        ]);

        const prompt1 = await prompt.invoke({ history: historyText });
        const result = await structuredLlm.invoke(prompt1);
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error generating workout suggestion:", error);
        res.status(500).json({ error: 'Server error generating suggestion.' });
    }
};

export const getWorkouts = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const user_id = req.user._id;
        const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const getSingleWorkout = async (req: CustomRequest, res: Response): Promise<void>  => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({ error: 'No such workout' });
            return;
        }
        
        const workout = await Workout.findById(id);

        if (!workout) {
            res.status(404).json({ error: 'No such workout' });
            return;
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const createWorkout = async (req: CustomRequest, res: Response): Promise<void>  => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const { title, reps, load } = req.body;
        const empty: string[] = [];

        if (!title) empty.push('title');
        if (!load) empty.push('load');
        if (!reps) empty.push('reps');

        if (empty.length > 0) {
            res.status(400).json({ error: 'Please fill in all fields', empty });
            return;
        }

        const user_id = req.user._id;
        const workout = await Workout.create({ title, reps, load, user_id });
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const deleteWorkout = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({ error: 'No such workout' });
            return;
        }

        const workout = await Workout.findOneAndDelete({ _id: id });

        if (!workout) {
            res.status(404).json({ error: 'No such workout' });
            return;
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const updateWorkout = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, reps, load } = req.body;

        const empty: string[] = [];
        if (!title) empty.push('title');
        if (!load) empty.push('load');
        if (!reps) empty.push('reps');

        if (empty.length > 0) {
            res.status(400).json({ error: 'Please fill in all fields', empty });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({ error: 'No such workout' });
            return;
        }

        const workout = await Workout.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );

        if (!workout) {
            res.status(404).json({ error: 'No such workout' });
            return;
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};