// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/server.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  // Add global setup and teardown
  globalSetup: '<rootDir>/__tests__/config/setup.ts',
  globalTeardown: '<rootDir>/__tests__/config/teardown.ts',
};