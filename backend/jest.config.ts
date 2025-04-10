import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true, // Enable code coverage
  coverageDirectory: 'coverage',
  testMatch: ['**/test/**/*.test.ts'], // Only test files ending in .test.ts
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Global setup file
};

export default config;
