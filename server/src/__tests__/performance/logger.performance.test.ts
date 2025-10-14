import logger from '../../utils/logger';
import { createErrorLog } from '../../utils/errorHandler';

describe('Logger Performance Tests', () => {
  describe('Logging performance', () => {
    it('should handle high volume of logs', () => {
      const startTime = Date.now();
      const logCount = 1000;

      for (let i = 0; i < logCount; i++) {
        logger.info(`Test log message ${i}`, { index: i });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete 1000 logs in less than 10 seconds (very realistic for winston with file logging)
      expect(duration).toBeLessThan(10000);
    });

    it('should handle error logging performance', () => {
      const startTime = Date.now();
      const errorCount = 100;

      for (let i = 0; i < errorCount; i++) {
        const error = new Error(`Test error ${i}`);
        logger.error('Test error message', createErrorLog(error, { index: i }));
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete 100 error logs in less than 2 seconds
      expect(duration).toBeLessThan(2000);
    });

    it('should handle large data objects', () => {
      const largeData = {
        users: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          metadata: {
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            preferences: {
              theme: 'dark',
              language: 'en',
              notifications: true,
            },
          },
        })),
      };

      const startTime = Date.now();
      logger.info('Large data log', largeData);
      const endTime = Date.now();

      const duration = endTime - startTime;
      // Should handle large data in less than 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Memory usage', () => {
    it('should not leak memory with repeated logging', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many logging operations
      for (let i = 0; i < 10000; i++) {
        logger.info(`Memory test log ${i}`, { 
          timestamp: Date.now(),
          data: `test data ${i}`,
        });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });
});

