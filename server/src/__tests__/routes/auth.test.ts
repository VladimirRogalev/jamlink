import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';

// Mock the logger BEFORE importing anything else
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Mock services BEFORE importing anything else
jest.mock('../../services/users.service', () => ({
  getUserByUsername: jest.fn(),
  addUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock('../../services/groups.service', () => ({
  getGroupByName: jest.fn(),
  addGroup: jest.fn(),
  createGroup: jest.fn(),
  getGroupById: jest.fn(),
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Now import after mocks
import { authRouter } from '../../routes/auth.router';
// Remove unused logger import since we're not testing logger calls
// import logger from '../../utils/logger';

// Remove unused mockLogger since we're not testing logger calls
// const mockLogger = logger as jest.Mocked<typeof logger>;

// Mock passport
jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, callback) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // Mock successful authentication
      if (callback) {
        callback(null, { id: '1', username: 'testuser', email: 'test@example.com', role: 'user' }, null);
      }
      next();
    };
  }),
}));

// Mock passport-local
jest.mock('passport-local', () => {
  return {
    Strategy: jest.fn().mockImplementation(() => {})
  };
});

const app = express();
app.use(express.json());

// Add middleware to mock req.login and req.logout
app.use((req: Request, res: Response, next: NextFunction) => {
  req.session = {};
  req.login = jest.fn() as any;
  req.logout = jest.fn() as any;
  
  // Mock the actual behavior
  (req.login as any).mockImplementation((user: Express.User, callback?: (err?: Error) => void) => {
    req.user = user;
    if (callback) callback();
  });
  
  (req.logout as any).mockImplementation((callback?: (err?: Error) => void) => {
    req.user = undefined;
    if (callback) callback();
  });
  
  next();
});

app.use('/auth', authRouter);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset all service mocks
    const { getUserByUsername, addUser } = require('../../services/users.service');
    const { getGroupByName, getGroupById } = require('../../services/groups.service');
    
    getUserByUsername.mockReturnValue(null);
    addUser.mockResolvedValue(null);
    getGroupByName.mockReturnValue(null);
    getGroupById.mockReturnValue(null);
  });

  describe('POST /auth/register', () => {
    it('should register user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      };

      // Mock services
      const { getUserByUsername, addUser } = require('../../services/users.service');
      const { getGroupByName } = require('../../services/groups.service');
      
      getUserByUsername.mockReturnValue(null); // User doesn't exist
      getGroupByName.mockReturnValue(null); // Group doesn't exist
      addUser.mockResolvedValue({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });

    it('should handle registration errors', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      };

      // Mock services to simulate user already exists
      const { getUserByUsername } = require('../../services/users.service');
      getUserByUsername.mockReturnValue({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      }); // User already exists

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(409); // Username already exists returns 409
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123',
      };

      // Mock passport to return successful user
      const passport = require('passport');
      passport.authenticate.mockImplementation((strategy: string, callback: ((err: Error | null, user: Express.User | false, info?: unknown) => void) | undefined) => {
        return (req: Request, res: Response, next: NextFunction) => {
          if (callback) {
            callback(null, { id: '1', username: 'testuser', email: 'test@example.com', role: 'user' }, null);
          }
          next();
        };
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });

    it('should handle login errors', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      // Mock passport to return no user (authentication failed)
      const passport = require('passport');
      passport.authenticate.mockImplementation((strategy: string, callback: ((err: Error | null, user: Express.User | false, info?: unknown) => void) | undefined) => {
        return (req: Request, res: Response, next: NextFunction) => {
          if (callback) {
            callback(null, false, { message: 'Invalid username or password' });
          }
          next();
        };
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid username or password');
    });
  });
});

