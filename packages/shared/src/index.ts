import { z } from 'zod';

export const PlayerColorSchema = z.enum(['red', 'blue', 'yellow', 'green']);
export type PlayerColor = z.infer<typeof PlayerColorSchema>;

export const GameMessageSchema = z.union([
  z.object({
    type: z.literal('ROLL_DICE'),
    matchId: z.string(),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal('MOVE_PIECE'),
    matchId: z.string(),
    playerId: z.string(),
    pieceId: z.string(),
  }),
  z.object({
    type: z.literal('JOIN_ROOM'),
    roomCode: z.string(),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal('CREATE_ROOM'),
    playerCount: z.enum(['2', '4']),
    playerId: z.string(),
  }),
]);

export type GameMessage = z.infer<typeof GameMessageSchema>;

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
