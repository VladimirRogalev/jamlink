module.exports = {
  preset: 'ts-jest',
  silent: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '.*/__tests__/global\\.d\\.ts$'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testTimeout: 30000, // Increased timeout for CI stability
  maxWorkers: process.env.CI ? 1 : '50%', // Single worker in CI, multiple locally
  forceExit: true, // Force exit after tests complete
  detectOpenHandles: false, // Disable to avoid noise in CI
  bail: process.env.CI ? 1 : false, // Stop on first failure in CI
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['jest', 'node']
      }
    }
  }
};
