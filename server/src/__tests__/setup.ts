// Jest setup file
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Global test utilities
(global as any).mockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  debug: jest.fn(),
};

// Test to ensure setup file is recognized by Jest
describe('Jest Setup', () => {
  it('should load test environment variables', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
