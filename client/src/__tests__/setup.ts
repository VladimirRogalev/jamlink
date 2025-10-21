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
(global as unknown as { localStorage: typeof localStorageMock }).localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
(global as unknown as { sessionStorage: typeof sessionStorageMock }).sessionStorage = sessionStorageMock;

// Mock fetch
(global as unknown as { fetch: jest.MockedFunction<typeof fetch> }).fetch = jest.fn();

// Mock console methods to avoid noise in tests
(global as unknown as { console: typeof console }).console = {
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
        MODE: 'development',
        DEV: true,
        PROD: false,
        SSR: false,
      },
    },
  },
  writable: true,
});

// Set NODE_ENV to development for tests
process.env.NODE_ENV = 'development';

// Test to ensure setup file is recognized by Jest
describe('Jest Setup', () => {
  it('should load test environment variables', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
