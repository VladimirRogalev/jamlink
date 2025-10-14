import { getErrorInfo, createErrorLog } from '../../utils/errorHandler';

describe('Error Handler', () => {
  describe('getErrorInfo', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error message');
      error.stack = 'Error: Test error message\n    at test.js:1:1';
      
      const result = getErrorInfo(error);
      
      expect(result).toEqual({
        message: 'Test error message',
        stack: 'Error: Test error message\n    at test.js:1:1',
      });
    });

    it('should handle string errors', () => {
      const error = 'String error message';
      
      const result = getErrorInfo(error);
      
      expect(result).toEqual({
        message: 'String error message',
      });
    });

    it('should handle objects with message property', () => {
      const error = {
        message: 'Object error message',
        stack: 'Object stack trace',
      };
      
      const result = getErrorInfo(error);
      
      expect(result).toEqual({
        message: 'Object error message',
        stack: 'Object stack trace',
      });
    });

    it('should handle objects without message property', () => {
      const error = { someProperty: 'value' };
      
      const result = getErrorInfo(error);
      
      expect(result).toEqual({
        message: '[object Object]',
      });
    });

    it('should handle null/undefined errors', () => {
      expect(getErrorInfo(null)).toEqual({ message: 'null' });
      expect(getErrorInfo(undefined)).toEqual({ message: 'undefined' });
    });

    it('should handle number errors', () => {
      const error = 404;
      
      const result = getErrorInfo(error);
      
      expect(result).toEqual({
        message: '404',
      });
    });
  });

  describe('createErrorLog', () => {
    it('should create error log with Error object', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack';
      const context = { userId: '123', action: 'test' };
      
      const result = createErrorLog(error, context);
      
      expect(result).toEqual({
        error: 'Test error',
        stack: 'Error stack',
        userId: '123',
        action: 'test',
      });
    });

    it('should create error log without context', () => {
      const error = new Error('Test error');
      
      const result = createErrorLog(error);
      
      expect(result).toEqual({
        error: 'Test error',
        stack: undefined,
      });
    });

    it('should create error log with string error', () => {
      const error = 'String error';
      const context = { module: 'auth' };
      
      const result = createErrorLog(error, context);
      
      expect(result).toEqual({
        error: 'String error',
        stack: undefined,
        module: 'auth',
      });
    });

    it('should handle complex context objects', () => {
      const error = new Error('Complex error');
      const context = {
        userId: '123',
        requestId: 'req-456',
        metadata: {
          timestamp: '2024-01-01',
          source: 'api',
        },
      };
      
      const result = createErrorLog(error, context);
      
      expect(result).toEqual({
        error: 'Complex error',
        stack: undefined,
        userId: '123',
        requestId: 'req-456',
        metadata: {
          timestamp: '2024-01-01',
          source: 'api',
        },
      });
    });
  });
});

