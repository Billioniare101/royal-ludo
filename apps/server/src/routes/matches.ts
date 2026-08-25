import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router: import("express").IRouter = Router();

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ hostId: req.userId }, { guestId: req.userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ matches });
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const match = await prisma.match.findUnique({ where: { id: req.params.id } });
  if (!match) {
    res.status(404).json({ error: 'Match not found' });
    return;
  }
  res.json({ match });
});

export { router as matchRouter };
