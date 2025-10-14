import logger from '../../utils/logger';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = mockSessionStorage;

describe('Client Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('{"id":"123"}');
    mockSessionStorage.getItem.mockReturnValue('session-123');
  });

  describe('Logging methods', () => {
    it('should call error method', () => {
      const message = 'Test error message';
      const data = { error: 'test error' };
      
      logger.error(message, data);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('🔴 [ERROR]')
      );
    });

    it('should call warn method', () => {
      const message = 'Test warning message';
      const data = { warning: 'test warning' };
      
      logger.warn(message, data);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('🟡 [WARN]')
      );
    });

    it('should call info method', () => {
      const message = 'Test info message';
      const data = { info: 'test info' };
      
      logger.info(message, data);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('🔵 [INFO]')
      );
    });

    it('should call debug method', () => {
      const message = 'Test debug message';
      const data = { debug: 'test debug' };
      
      logger.debug(message, data);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('⚪ [DEBUG]')
      );
    });
  });

  describe('Log formatting', () => {
    it('should format log message with timestamp', () => {
      const message = 'Test message';
      
      logger.info(message);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/🔵 \[INFO\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z Test message/)
      );
    });

    it('should format log message with data', () => {
      const message = 'Test message';
      const data = { key: 'value', number: 123 };
      
      logger.info(message, data);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Test message')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"key": "value"')
      );
    });
  });

  describe('User ID extraction', () => {
    it('should extract user ID from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('{"id":"user-123"}');
      
      logger.info('Test message');
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
    });

    it('should handle missing user in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      logger.info('Test message');
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
    });

    it('should handle invalid JSON in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      
      logger.info('Test message');
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
    });
  });

  describe('Session ID management', () => {
    it('should get existing session ID', () => {
      mockSessionStorage.getItem.mockReturnValue('existing-session');
      
      logger.info('Test message');
      
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('sessionId');
    });

    it('should create new session ID if not exists', () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      
      logger.info('Test message');
      
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('sessionId');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'sessionId',
        expect.any(String)
      );
    });
  });

  describe('Production mode', () => {
    it('should send logs to server in production', async () => {
      // Mock production environment
      const originalEnv = import.meta.env.MODE;
      Object.defineProperty(import.meta, 'env', {
        value: { MODE: 'production' },
        writable: true,
      });

      mockFetch.mockResolvedValue({ ok: true });

      const message = 'Test message';
      const data = { test: 'data' };
      
      logger.info(message, data);
      
      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockFetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining(message),
      });

      // Restore original environment
      Object.defineProperty(import.meta, 'env', {
        value: { MODE: originalEnv },
        writable: true,
      });
    });

    it('should handle server send errors', async () => {
      // Mock production environment
      const originalEnv = import.meta.env.MODE;
      Object.defineProperty(import.meta, 'env', {
        value: { MODE: 'production' },
        writable: true,
      });

      mockFetch.mockRejectedValue(new Error('Network error'));

      logger.info('Test message');
      
      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to send log to server:',
        expect.any(Error)
      );

      // Restore original environment
      Object.defineProperty(import.meta, 'env', {
        value: { MODE: originalEnv },
        writable: true,
      });
    });
  });
});

