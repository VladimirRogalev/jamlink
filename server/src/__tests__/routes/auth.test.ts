import request from 'supertest';
import express from 'express';
import { authRouter } from '../../routes/auth.router';
import logger from '../../utils/logger';

// Mock the logger
jest.mock('../../utils/logger');

const mockLogger = logger as jest.Mocked<typeof logger>;

// Mock services
jest.mock('../../services/users.service', () => ({
  getUserByUsername: jest.fn(),
  addUser: jest.fn(),
  getUserById: jest.fn(),
}));

jest.mock('../../services/groups.service', () => ({
  getGroupByName: jest.fn(),
  addGroup: jest.fn(),
}));

// Mock passport
jest.mock('../../config/passport', () => ({
  authenticate: jest.fn((strategy) => (req: any, res: any, next: any) => next()),
}));

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      };

      // Mock successful user creation
      const { addUser } = require('../../services/users.service');
      addUser.mockResolvedValue({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('User registered'),
        expect.any(Object)
      );
    });

    it('should handle registration errors', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      };

      // Mock service to throw error
      const { addUser } = require('../../services/users.service');
      addUser.mockRejectedValue(new Error('User already exists'));

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(500);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error registering user'),
        expect.any(Object)
      );
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123',
      };

      // Mock successful user lookup
      const { getUserByUsername } = require('../../services/users.service');
      getUserByUsername.mockResolvedValue({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword',
        email: 'test@example.com'
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('User logged in'),
        expect.any(Object)
      );
    });

    it('should handle login errors', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      // Mock user not found
      const { getUserByUsername } = require('../../services/users.service');
      getUserByUsername.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Login failed'),
        expect.any(Object)
      );
    });
  });
});

