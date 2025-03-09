import { Express } from 'express';

export const mockApp = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
} as unknown as Express;
