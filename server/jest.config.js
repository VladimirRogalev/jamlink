module.exports = {
  preset: 'ts-jest',
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
  maxWorkers: 1, // Use single worker to avoid Windows EPERM issues
  forceExit: true, // Force exit after tests complete
  detectOpenHandles: false, // Disable to avoid noise in CI
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['jest', 'node']
      }
    }
  }
};
