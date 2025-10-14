import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
(global as any).localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
(global as any).sessionStorage = sessionStorageMock;

// Mock fetch
(global as any).fetch = jest.fn();

// Mock console methods to avoid noise in tests
(global as any).console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock import.meta for Vite
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        MODE: 'test',
        DEV: false,
        PROD: true,
        SSR: false,
      },
    },
  },
  writable: true,
});

// Test to ensure setup file is recognized by Jest
describe('Jest Setup', () => {
  it('should load test environment variables', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
