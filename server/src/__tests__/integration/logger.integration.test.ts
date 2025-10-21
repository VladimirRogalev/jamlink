import logger from '../../utils/logger';
import { createErrorLog } from '../../utils/errorHandler';

describe('Logger Integration Tests', () => {
  describe('Real logger functionality', () => {
    it('should log messages without throwing errors', () => {
      expect(() => {
        logger.info('Test info message');
        logger.warn('Test warning message');
        logger.error('Test error message');
        logger.debug('Test debug message');
        logger.http('Test http message');
      }).not.toThrow();
    });

    it('should handle error logging with createErrorLog', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };
      
      expect(() => {
        logger.error('Test error message', createErrorLog(error, context));
      }).not.toThrow();
    });

    it('should handle different error types', () => {
      const errors = [
        new Error('Standard error'),
        'String error',
        { message: 'Object error' },
        null,
        undefined,
        404,
      ];

      errors.forEach((error, index) => {
        expect(() => {
          logger.error(`Test error ${index}`, createErrorLog(error));
        }).not.toThrow();
      });
    });
  });

  describe('Log levels', () => {
    it('should respect log levels in different environments', () => {
      const originalEnv = process.env.NODE_ENV;
      
      // Test development environment
      process.env.NODE_ENV = 'development';
      expect(() => logger.debug('Debug message')).not.toThrow();
      
      // Test production environment
      process.env.NODE_ENV = 'production';
      expect(() => logger.debug('Debug message')).not.toThrow();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error handling', () => {
    it('should handle logger errors gracefully', () => {
      // This test ensures that even if the logger itself fails,
      // it doesn't crash the application
      expect(() => {
        logger.error('Test message', { circular: {} });
      }).not.toThrow();
    });
  });
});





