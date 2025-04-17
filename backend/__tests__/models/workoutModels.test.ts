import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { setupTestDB, teardownTestDB, clearDatabase } from '../setup';
import Workout from '../../src/models/workoutModels';

describe('Workout Model', () => {
  // Set up the in-memory database
  beforeAll(async () => {
    await setupTestDB();
  });

  // Clear database after each test
  afterEach(async () => {
    await clearDatabase();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await teardownTestDB();
  });

  it('should create a new workout with valid data', async () => {
    // Arrange
    const userId = new mongoose.Types.ObjectId();
    const workoutData = {
      title: 'Push Ups',
      reps: 15,
      load: 0,
      user_id: userId
    };

    // Act
    const workout = await Workout.create(workoutData);

    // Assert
    expect(workout._id).toBeDefined();
    expect(workout.title).toBe('Push Ups');
    expect(workout.reps).toBe(15);
    expect(workout.load).toBe(0);
    expect(workout.user_id).toEqual(userId);
    expect(workout.createdAt).toBeDefined();
    expect(workout.updatedAt).toBeDefined();
  });

  it('should fail validation when title is missing', async () => {
    // Arrange
    const userId = new mongoose.Types.ObjectId();
    const workoutData = {
      // title is missing
      reps: 15,
      load: 0,
      user_id: userId
    };

    // Act & Assert
    await expect(Workout.create(workoutData)).rejects.toThrow();
  });

  it('should fail validation when reps is missing', async () => {
    // Arrange
    const userId = new mongoose.Types.ObjectId();
    const workoutData = {
      title: 'Push Ups',
      // reps is missing
      load: 0,
      user_id: userId
    };

    // Act & Assert
    await expect(Workout.create(workoutData)).rejects.toThrow();
  });

  it('should find workouts by user_id', async () => {
    // Arrange
    const userId1 = new mongoose.Types.ObjectId();
    const userId2 = new mongoose.Types.ObjectId();
    
    // Create workouts for user 1
    await Workout.create({
      title: 'Push Ups',
      reps: 15,
      load: 0,
      user_id: userId1
    });
    
    await Workout.create({
      title: 'Pull Ups',
      reps: 10,
      load: 0,
      user_id: userId1
    });
    
    // Create workout for user 2
    await Workout.create({
      title: 'Squats',
      reps: 20,
      load: 50,
      user_id: userId2
    });

    // Act
    const user1Workouts = await Workout.find({ user_id: userId1 });
    const user2Workouts = await Workout.find({ user_id: userId2 });

    // Assert
    expect(user1Workouts).toHaveLength(2);
    expect(user1Workouts[0].title).toBe('Push Ups');
    expect(user1Workouts[1].title).toBe('Pull Ups');
    
    expect(user2Workouts).toHaveLength(1);
    expect(user2Workouts[0].title).toBe('Squats');
  });
});