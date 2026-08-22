import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { LoginSchema, RegisterSchema } from '@royal-ludo/shared';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { createRateLimitMiddleware } from '../middleware/rateLimit.js';

type PrismaLike = Pick<typeof prisma, 'user'>;

export function createAuthRouter(prismaClient: PrismaLike = prisma): Router {
  const router = Router();
  const rateLimit = createRateLimitMiddleware();

  router.use(rateLimit);

  router.post('/register', async (req, res) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    try {
      const passwordHash = await bcrypt.hash(parsed.data.password, 10);
      const user = await prismaClient.user.create({
        data: {
          username: parsed.data.username,
          email: parsed.data.email,
          passwordHash,
        },
      });

      const token = signToken({ userId: user.id, username: user.username });
      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(409).json({
        error: error instanceof Error ? error.message : 'Unable to register user',
      });
    }
  });

  router.post('/login', async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signToken({ userId: user.id, username: user.username });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  });

  router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  });

  return router;
}

export const authRouter = createAuthRouter();
