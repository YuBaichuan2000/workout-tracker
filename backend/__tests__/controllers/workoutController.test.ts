import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createWorkout, getWorkouts, deleteWorkout } from '../../src/controllers/workoutController';
import Workout from '../../src/models/workoutModels';

// Mock Workout model
vi.mock('../../src/models/workoutModels');

describe('Workout Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      user: {
        _id: new mongoose.Types.ObjectId()
      }
    };
    
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    
    vi.clearAllMocks();
  });

  describe('createWorkout', () => {
    it('should create a new workout when all fields are provided', async () => {
      // Arrange
      const workoutData = {
        title: 'Bench Press',
        reps: 10,
        load: 100
      };
      
      mockRequest.body = workoutData;
      
      const createdWorkout = {
        _id: new mongoose.Types.ObjectId(),
        ...workoutData,
        user_id: mockRequest.user?._id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      vi.spyOn(Workout, 'create').mockResolvedValue(createdWorkout as any);
      
      // Act
      await createWorkout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Workout.create).toHaveBeenCalledWith({
        ...workoutData,
        user_id: mockRequest.user?._id
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(createdWorkout);
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Arrange
      mockRequest.body = {
        title: 'Bench Press'
        // Missing reps and load
      };
      
      // Act
      await createWorkout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Please fill in all fields',
          empty: expect.arrayContaining(['load', 'reps'])
        })
      );
      expect(Workout.create).not.toHaveBeenCalled();
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;
      mockRequest.body = {
        title: 'Bench Press',
        reps: 10,
        load: 100
      };
      
      // Act
      await createWorkout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
      expect(Workout.create).not.toHaveBeenCalled();
    });
  });
  
  describe('getWorkouts', () => {
    it('should return all workouts for the authenticated user', async () => {
      // Arrange
      const userId = mockRequest.user?._id;
      const mockWorkouts = [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Bench Press',
          reps: 10,
          load: 100,
          user_id: userId
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Squats',
          reps: 15,
          load: 120,
          user_id: userId
        }
      ];
      
      const mockSort = vi.fn().mockReturnValue(mockWorkouts);
      const mockFind = vi.fn().mockReturnValue({
        sort: mockSort
      });
      
      vi.spyOn(Workout, 'find').mockImplementation(mockFind);
      
      // Act
      await getWorkouts(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Workout.find).toHaveBeenCalledWith({ user_id: userId });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockWorkouts);
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await getWorkouts(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
      expect(Workout.find).not.toHaveBeenCalled();
    });
  });
  
  describe('deleteWorkout', () => {
    it('should delete a workout when valid ID is provided', async () => {
      // Arrange
      const workoutId = new mongoose.Types.ObjectId();
      mockRequest.params = { id: workoutId.toString() };
      
      const deletedWorkout = {
        _id: workoutId,
        title: 'Bench Press',
        reps: 10,
        load: 100,
        user_id: mockRequest.user?._id
      };
      
      vi.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      vi.spyOn(Workout, 'findOneAndDelete').mockResolvedValue(deletedWorkout as any);
      
      // Act
      await deleteWorkout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Workout.findOneAndDelete).toHaveBeenCalledWith({ _id: workoutId.toString() });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(deletedWorkout);
    });
    
    it('should return 404 if workout ID is invalid', async () => {
      // Arrange
      mockRequest.params = { id: 'invalid-id' };
      
      vi.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
      
      // Act
      await deleteWorkout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No such workout' });
      expect(Workout.findOneAndDelete).not.toHaveBeenCalled();
    });
    
    it('should return 404 if workout is not found', async () => {
      // Arrange
      const workoutId = new mongoose.Types.ObjectId();
      mockRequest.params = { id: workoutId.toString() };
      
      vi.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      vi.spyOn(Workout, 'findOneAndDelete').mockResolvedValue(null);
      
      // Act
      await deleteWorkout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No such workout' });
    });
  });
});