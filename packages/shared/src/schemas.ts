import { z } from 'zod';

export const ColorSchema = z.enum(['red', 'green', 'blue', 'yellow']);
export const PieceStateSchema = z.enum(['home', 'active', 'finished']);
export const GameStatusSchema = z.enum(['waiting', 'playing', 'finished']);

export const PieceSchema = z.object({
  id: z.string(),
  color: ColorSchema,
  state: PieceStateSchema,
  position: z.number().int().min(-1).max(57),
});

export const PlayerSchema = z.object({
  id: z.string(),
  username: z.string().min(1).max(32),
  color: ColorSchema,
  pieces: z.array(PieceSchema),
  isReady: z.boolean(),
});

export const GameStateSchema = z.object({
  id: z.string(),
  roomCode: z.string().length(6),
  status: GameStatusSchema,
  players: z.array(PlayerSchema).min(1).max(4),
  currentPlayerIndex: z.number().int().min(0).max(3),
  diceValue: z.number().int().min(1).max(6).nullable(),
  diceRolled: z.boolean(),
  winner: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RegisterSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateRoomSchema = z.object({
  maxPlayers: z.number().int().min(2).max(4).default(4),
});

export const JoinRoomSchema = z.object({
  roomCode: z.string().length(6),
});
