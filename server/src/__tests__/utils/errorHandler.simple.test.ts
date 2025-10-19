import { getErrorInfo, createErrorLog } from '../../utils/errorHandler';

describe('Error Handler Simple Tests', () => {
  describe('getErrorInfo', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error');
      const result = getErrorInfo(error);
      
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Test error');
    });

    it('should handle string errors', () => {
      const error = 'String error';
      const result = getErrorInfo(error);
      
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('String error');
    });

    it('should handle null/undefined', () => {
      expect(getErrorInfo(null)).toHaveProperty('message');
      expect(getErrorInfo(undefined)).toHaveProperty('message');
    });
  });

  describe('createErrorLog', () => {
    it('should create error log with Error object', () => {
      const error = new Error('Test error');
      const result = createErrorLog(error);
      
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('Test error');
    });

    it('should create error log with context', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };
      const result = createErrorLog(error, context);
      
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('action');
    });

    it('should handle different error types', () => {
      const errors = [
        new Error('Standard error'),
        'String error',
        { message: 'Object error' },
        null,
        undefined,
      ];

      errors.forEach((error, index) => {
        expect(() => {
          createErrorLog(error, { index });
        }).not.toThrow();
      });
    });
  });
});



