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
  testMatch: ['**/test/integration/*.int.test.ts'], // Only test files ending in .test.ts
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.ts'], // Global setup file
};

export default config;
