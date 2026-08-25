import { Router, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router: import("express").IRouter = Router();

function generateRoomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const CreateRoomSchema = z.object({
  playerCount: z.enum(['2', '4']),
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const parse = CreateRoomSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }
  const code = generateRoomCode();
  const room = await prisma.room.create({
    data: {
      id: uuidv4(),
      code,
      hostId: req.userId!,
      maxPlayers: parseInt(parse.data.playerCount),
      status: 'waiting',
    },
  });
  res.status(201).json({ room });
});

router.post('/join', requireAuth, async (req: AuthRequest, res: Response) => {
  const { code } = req.body as { code?: string };
  if (!code) {
    res.status(400).json({ error: 'Room code required' });
    return;
  }
  const room = await prisma.room.findUnique({ where: { code: code.toUpperCase() } });
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  if (room.status !== 'waiting') {
    res.status(409).json({ error: 'Room not accepting players' });
    return;
  }
  res.json({ room });
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const room = await prisma.room.findUnique({ where: { id: req.params.id } });
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json({ room });
});

export { router as roomRouter };
