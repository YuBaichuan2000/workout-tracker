import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkout extends Document {
    title: string;
    reps: number;
    load: number;
    user_id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const workoutSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Workout: Model<IWorkout> = mongoose.model<IWorkout>('Workout', workoutSchema);

export default Workout;