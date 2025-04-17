import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import testApp from '../testServer';  
import { 
  setupTestDB, 
  teardownTestDB, 
  clearDatabase,
  createTestUser,
  authRequest 
} from '../setup';
import Workout from '../../src/models/workoutModels';


describe('Workout API Integration Tests', () => {
  let userId: mongoose.Types.ObjectId;
  let authToken: string;
  
  // Set up test database before all tests
  beforeAll(async () => {
    await setupTestDB();
    const auth = await createTestUser();
    userId = auth.userId;
    authToken = auth.token;
  });
  
  // Clear database between tests
  beforeEach(async () => {
    await clearDatabase();
  });
  
  // Clean up after all tests
  afterAll(async () => {
    await teardownTestDB();
  });
  
  describe('GET /api/workouts', () => {
    it('should return all workouts for authenticated user', async () => {
      // Create test workouts
      await Workout.create([
        { title: 'Push Ups', reps: 15, load: 0, user_id: userId },
        { title: 'Pull Ups', reps: 10, load: 0, user_id: userId }
      ]);
      
      // Make request
      const response = await authRequest(testApp, authToken).get('/api/workouts');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Push Ups');
      expect(response.body[1].title).toBe('Pull Ups');
    });
  });
  
  // Add more test cases here...
});