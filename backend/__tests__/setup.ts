import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Express } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/userModels';

dotenv.config();

let mongoServer: MongoMemoryServer;

// Connect to the in-memory database before all tests
export const setupTestDB = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

// Close database connection and stop mongodb-memory-server after all tests
export const teardownTestDB = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

// Clear all collections between tests
export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

// Integration test helpers - additional functionality
// Helper to create a test user and get auth token
export const createTestUser = async (): Promise<{
  userId: mongoose.Types.ObjectId;
  token: string;
}> => {
  // Create a test user
  const user = await User.create({
    email: `test-${Date.now()}@example.com`,
    password: 'hashedPassword123',
    isVerified: true
  });

  // Generate JWT token
  const secret = process.env.SECRET || 'test-secret';
  const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1d' });

  return { userId: user._id, token };
};

// Helper to make authenticated requests
export const authRequest = (app: Express, token: string) => {
  return {
    get: (url: string) => request(app).get(url).set('Cookie', [`token=${token}`]),
    post: (url: string, body?: any) => request(app).post(url).set('Cookie', [`token=${token}`]).send(body),
    patch: (url: string, body?: any) => request(app).patch(url).set('Cookie', [`token=${token}`]).send(body),
    delete: (url: string) => request(app).delete(url).set('Cookie', [`token=${token}`])
  };
};