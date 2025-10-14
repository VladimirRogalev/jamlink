import logger from '../../utils/logger';

describe('Logger Simple Tests', () => {
  describe('Logger methods', () => {
    it('should have all logging methods', () => {
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.http).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should call logging methods without throwing', () => {
      expect(() => {
        logger.error('Test error message');
        logger.warn('Test warning message');
        logger.info('Test info message');
        logger.http('Test http message');
        logger.debug('Test debug message');
      }).not.toThrow();
    });

    it('should handle logging with data', () => {
      expect(() => {
        logger.info('Test message', { key: 'value', number: 123 });
        logger.error('Test error', { error: 'test error', stack: 'test stack' });
      }).not.toThrow();
    });
  });

  describe('Logger configuration', () => {
    it('should be configured for different environments', () => {
      const originalEnv = process.env.NODE_ENV;
      
      // Test development
      process.env.NODE_ENV = 'development';
      expect(() => logger.debug('Debug message')).not.toThrow();
      
      // Test production
      process.env.NODE_ENV = 'production';
      expect(() => logger.info('Info message')).not.toThrow();
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});

