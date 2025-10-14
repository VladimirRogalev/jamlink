import winston from 'winston';

// Mock winston before importing logger
jest.mock('winston', () => {
  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    http: jest.fn(),
    debug: jest.fn(),
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      colorize: jest.fn(),
      printf: jest.fn(),
      json: jest.fn(),
      simple: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
    addColors: jest.fn(),
  };
});

import logger from '../../utils/logger';

describe('Logger', () => {
  let mockLogger: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      http: jest.fn(),
      debug: jest.fn(),
    };
    (winston.createLogger as jest.Mock).mockReturnValue(mockLogger);
  });

  describe('Logger initialization', () => {
    it('should create logger with correct configuration', () => {
      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: expect.any(String),
          levels: expect.any(Object),
          format: expect.any(Object),
          transports: expect.any(Array),
        })
      );
    });

    it('should set debug level in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      // Re-import logger to trigger initialization
      jest.resetModules();
      require('../../utils/logger');
      
      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'debug',
        })
      );
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should set info level in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Re-import logger to trigger initialization
      jest.resetModules();
      require('../../utils/logger');
      
      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
        })
      );
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Logging methods', () => {
    it('should call error method', () => {
      const message = 'Test error message';
      const data = { error: 'test error' };
      
      logger.error(message, data);
      
      expect(mockLogger.error).toHaveBeenCalledWith(message, data);
    });

    it('should call warn method', () => {
      const message = 'Test warning message';
      const data = { warning: 'test warning' };
      
      logger.warn(message, data);
      
      expect(mockLogger.warn).toHaveBeenCalledWith(message, data);
    });

    it('should call info method', () => {
      const message = 'Test info message';
      const data = { info: 'test info' };
      
      logger.info(message, data);
      
      expect(mockLogger.info).toHaveBeenCalledWith(message, data);
    });

    it('should call http method', () => {
      const message = 'Test http message';
      const data = { method: 'GET', url: '/test' };
      
      logger.http(message, data);
      
      expect(mockLogger.http).toHaveBeenCalledWith(message, data);
    });

    it('should call debug method', () => {
      const message = 'Test debug message';
      const data = { debug: 'test debug' };
      
      logger.debug(message, data);
      
      expect(mockLogger.debug).toHaveBeenCalledWith(message, data);
    });
  });

  describe('Log levels', () => {
    it('should have correct log levels', () => {
      const expectedLevels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
      };

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          levels: expectedLevels,
        })
      );
    });
  });

  describe('Log colors', () => {
    it('should add colors to winston', () => {
      expect(winston.addColors).toHaveBeenCalledWith({
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white',
      });
    });
  });
});
