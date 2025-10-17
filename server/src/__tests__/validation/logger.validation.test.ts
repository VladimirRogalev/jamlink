import logger from '../../utils/logger';
import { createErrorLog } from '../../utils/errorHandler';

// Skip validation tests in CI due to performance constraints
const describeOrSkip = process.env.CI ? describe.skip : describe;

describeOrSkip('Logger Validation Tests', () => {
  describe('Input validation', () => {
    it('should validate log messages', () => {
      const validMessages = [
        'Simple message',
        'Message with numbers 123',
        'Message with symbols !@#$%^&*()',
        'Message with unicode 🎵🎶',
        'Message with newlines\nand tabs\t',
        '',
        ' '.repeat(1000), // Long message
      ];

      validMessages.forEach((message, index) => {
        expect(() => {
          logger.info(`Validation test ${index}: ${message}`);
        }).not.toThrow();
      });
    });

    it('should validate log data', () => {
      const validData = [
        { key: 'value' },
        { nested: { deep: { value: 'test' } } },
        { array: [1, 2, 3] },
        { date: new Date() },
        { regex: /test/g },
        { fn: () => 'test' },
        null,
        undefined,
        {},
        [],
      ];

      validData.forEach((data, index) => {
        expect(() => {
          logger.info(`Data validation test ${index}`, data);
        }).not.toThrow();
      });
    });
  });

  describe('Error validation', () => {
    it('should validate error types', () => {
      const validErrors = [
        new Error('Standard error'),
        new TypeError('Type error'),
        new ReferenceError('Reference error'),
        new SyntaxError('Syntax error'),
        new RangeError('Range error'),
        'String error',
        { message: 'Object error' },
        { error: 'Nested error' },
        null,
        undefined,
        0,
        false,
        true,
        [],
        {},
      ];

      validErrors.forEach((error, index) => {
        expect(() => {
          logger.error(`Error validation test ${index}`, createErrorLog(error));
        }).not.toThrow();
      });
    });
  });

  describe('Performance validation', () => {
    it('should validate logging performance', () => {
      const startTime = Date.now();
      const logCount = 1000;

      for (let i = 0; i < logCount; i++) {
        logger.info(`Performance validation test ${i}`, { index: i });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete 1000 logs in reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds
    });
  });

  describe('Memory validation', () => {
    it('should validate memory usage', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform logging operations
      for (let i = 0; i < 1000; i++) {
        logger.info(`Memory validation test ${i}`, { 
          data: `test data ${i}`,
          timestamp: Date.now(),
        });
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // Less than 100MB
    });
  });
});


