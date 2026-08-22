import http from 'node:http';
import bcrypt from 'bcryptjs';
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAuthRouter } from '../routes/auth.js';
import { signToken } from '../lib/jwt.js';

const passwordHash = await bcrypt.hash('secret123', 10);

const prismaMock = {
  user: {
    async create({ data }: { data: { username: string; email: string; passwordHash: string } }) {
      return {
        id: 'user-2',
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
      };
    },
    async findUnique({
      where,
      select,
    }: {
      where: { email?: string; id?: string };
      select?: { id: true; username: true; email: true; createdAt: true };
    }) {
      if (where.email === 'alice@example.com') {
        return {
          id: 'user-1',
          username: 'alice',
          email: 'alice@example.com',
          passwordHash,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        };
      }

      if (where.id === 'user-1' && select) {
        return {
          id: 'user-1',
          username: 'alice',
          email: 'alice@example.com',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        };
      }

      return null;
    },
  },
};

describe('auth routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', createAuthRouter(prismaMock as never));

  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const address = server.address();
        if (!address || typeof address === 'string') {
          throw new Error('Failed to bind test server');
        }
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  it('registers a user and returns a token', async () => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'new-user',
        email: 'new@example.com',
        password: 'secret123',
      }),
    });

    expect(response.status).toBe(201);
    const body = (await response.json()) as { token: string; user: { email: string } };
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe('new@example.com');
  });

  it('logs in an existing user', async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'secret123',
      }),
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { user: { username: string } };
    expect(body.user.username).toBe('alice');
  });

  it('returns the current user profile', async () => {
    const token = signToken({ userId: 'user-1', username: 'alice' });
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { user: { id: string } };
    expect(body.user.id).toBe('user-1');
  });
});
