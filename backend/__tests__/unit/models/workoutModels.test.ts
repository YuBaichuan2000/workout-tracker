// __tests__/unit/models/workoutModels.test.ts
import mongoose from 'mongoose';
import Workout from '../../../src/models/workoutModels.js';
import { clearDB } from '../../config/mongoTestSetup';

describe('Workout Model', () => {
  // Clear database after each test
  afterEach(async () => {
    await clearDB();
  });

  it('should create a new workout successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const workoutData = {
      title: 'Test Workout',
      reps: 10,
      load: 50,
      user_id: userId
    };

    const workout = await Workout.create(workoutData);
    
    expect(workout).toBeDefined();
    expect(workout.title).toBe(workoutData.title);
    expect(workout.reps).toBe(workoutData.reps);
    expect(workout.load).toBe(workoutData.load);
    expect(workout.user_id).toEqual(userId);
    expect(workout.createdAt).toBeDefined();
  });

  it('should fail when required fields are missing', async () => {
    const incompleteWorkout = {
      title: 'Incomplete Workout',
      // Missing reps and load
      user_id: new mongoose.Types.ObjectId()
    };

    await expect(Workout.create(incompleteWorkout))
      .rejects
      .toThrow();
  });
});