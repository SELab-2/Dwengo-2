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
  testMatch: ['**/test/unit/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.unit.setup.ts'], // Only test files ending in .test.ts
};

export default config;
