import { Router } from 'express';
import { CreateRoomSchema, JoinRoomSchema } from '@royal-ludo/shared';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { createRateLimitMiddleware } from '../middleware/rateLimit.js';
import { roomManager } from '../rooms/manager.js';

export const roomsRouter: ReturnType<typeof Router> = Router();
const rateLimit = createRateLimitMiddleware();

roomsRouter.use(rateLimit, authMiddleware);

roomsRouter.post('/', (req: AuthRequest, res) => {
  const parsed = CreateRoomSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const room = roomManager.createRoom(user.userId, parsed.data.maxPlayers, user.username);
  res.status(201).json({ room });
});

roomsRouter.post('/:code/join', (req: AuthRequest, res) => {
  const parsed = JoinRoomSchema.safeParse({ roomCode: req.params.code });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const room = roomManager.joinRoom(parsed.data.roomCode, {
      id: user.userId,
      username: user.username,
    });
    res.json({ room });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to join room' });
  }
});

roomsRouter.get('/:code', (req, res) => {
  const room = roomManager.getRoom(req.params.code);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  res.json({ room });
});
