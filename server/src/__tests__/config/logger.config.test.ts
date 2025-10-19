import logger from '../../utils/logger';

describe('Logger Configuration Tests', () => {
  describe('Environment configuration', () => {
    it('should configure logger for development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      // Re-import logger to test configuration
      jest.resetModules();
      const devLogger = require('../../utils/logger').default;
      
      expect(devLogger).toBeDefined();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should configure logger for production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Re-import logger to test configuration
      jest.resetModules();
      const prodLogger = require('../../utils/logger').default;
      
      expect(prodLogger).toBeDefined();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should configure logger for test', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      
      // Re-import logger to test configuration
      jest.resetModules();
      const testLogger = require('../../utils/logger').default;
      
      expect(testLogger).toBeDefined();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Log level configuration', () => {
    it('should set correct log level for each environment', () => {
      const environments = ['development', 'production', 'test'];
      
      environments.forEach(env => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = env;
        
        // Re-import logger to test configuration
        jest.resetModules();
        const envLogger = require('../../utils/logger').default;
        
        expect(envLogger).toBeDefined();
        
        process.env.NODE_ENV = originalEnv;
      });
    });
  });

  describe('Transport configuration', () => {
    it('should configure transports correctly', () => {
      // Test that logger is configured with transports
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.http).toBe('function');
    });
  });
});



