import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import requireAuth from '../../src/middleware/requireAuth';
import User from '../../src/models/userModels';

// Set up mocks
vi.mock('../../src/models/userModels');
vi.mock('jsonwebtoken');

describe('requireAuth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
    };
    
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    
    nextFunction = vi.fn();
    
    // Reset environment variables
    process.env.SECRET = 'test-secret';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    // Act
    await requireAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Authorization token required'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if valid token is provided', async () => {
    // Arrange
    const userId = new mongoose.Types.ObjectId();
    const mockUser = { _id: userId };
    
    // Set up JWT verify mock
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      return { _id: userId.toString() };
    });
    
    // Set up User.findOne mock
    vi.spyOn(User, 'findOne').mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    } as any);
    
    mockRequest.cookies = { token: 'valid-token' };

    // Act
    await requireAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(User.findOne).toHaveBeenCalledWith({ _id: userId.toString() });
    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 if token verification fails', async () => {
    // Arrange
    mockRequest.cookies = { token: 'invalid-token' };
    
    // Mock JWT verify to throw error
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act
    await requireAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      error: 'Request is not authorized' 
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if user not found', async () => {
    // Arrange
    const userId = new mongoose.Types.ObjectId();
    
    // Set up JWT verify mock
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      return { _id: userId.toString() };
    });
    
    // Set up User.findOne mock to return null user
    vi.spyOn(User, 'findOne').mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    } as any);
    
    mockRequest.cookies = { token: 'valid-token' };

    // Act
    await requireAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      error: 'User not found' 
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});