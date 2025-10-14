import request from 'supertest';
import express from 'express';
import logger from '../../utils/logger';
import { createErrorLog } from '../../utils/errorHandler';

// Mock the logger
jest.mock('../../utils/logger');

const mockLogger = logger as jest.Mocked<typeof logger>;

const app = express();
app.use(express.json());

// Test endpoint that uses logger
app.post('/test-log', (req, res) => {
  try {
    const { message, data } = req.body;
    logger.info('Test log endpoint called', { message, data });
    res.json({ success: true });
  } catch (error) {
    logger.error('Test log endpoint error', createErrorLog(error));
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Test endpoint that throws error
app.post('/test-error', (req, res) => {
  try {
    throw new Error('Test error');
  } catch (error) {
    logger.error('Test error endpoint', createErrorLog(error));
    res.status(500).json({ success: false, error: 'Test error' });
  }
});

describe('Logger E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API endpoints with logging', () => {
    it('should log API requests', async () => {
      const response = await request(app)
        .post('/test-log')
        .send({ message: 'Test message', data: { key: 'value' } });

      expect(response.status).toBe(200);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test log endpoint called',
        { message: 'Test message', data: { key: 'value' } }
      );
    });

    it('should log API errors', async () => {
      const response = await request(app)
        .post('/test-error')
        .send({});

      expect(response.status).toBe(500);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Test error endpoint',
        expect.any(Object)
      );
    });

    it('should handle malformed requests', async () => {
      const response = await request(app)
        .post('/test-log')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      // Express with default JSON parser returns 400 for malformed JSON
      expect(response.status).toBe(400);
    });
  });

  describe('Error handling flow', () => {
    it('should handle complete error flow', async () => {
      const response = await request(app)
        .post('/test-error')
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Test error'
      });
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});

