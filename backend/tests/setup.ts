import { vi } from 'vitest'

// Mock env.ts to avoid dotenv side effects and process.exit on validation failure
vi.mock('../src/config/env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3001,
    GEMINI_API_KEY: 'test-api-key',
    CORS_ORIGIN: 'http://localhost:5173',
    LOG_LEVEL: 'error',
    DATABASE_URL: 'mysql://test:test@localhost:3306/test',
  },
}))

// Mock Prisma client to prevent database connections
vi.mock('../src/config/prisma', () => ({
  prisma: {
    aiApiLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}))

// Mock logger to prevent console output during tests
vi.mock('../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))
