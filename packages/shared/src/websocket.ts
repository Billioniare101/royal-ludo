import type { GameState } from './types.js';

export type ClientMessage =
  | { type: 'join_room'; roomCode: string; token: string }
  | { type: 'leave_room'; roomCode: string }
  | { type: 'player_ready'; roomCode: string }
  | { type: 'roll_dice'; roomCode: string }
  | { type: 'move_piece'; roomCode: string; pieceId: string }
  | { type: 'ping' };

export type ServerMessage =
  | { type: 'connected'; playerId: string }
  | { type: 'room_joined'; game: GameState }
  | { type: 'room_left'; roomCode: string }
  | { type: 'game_state_update'; game: GameState }
  | { type: 'player_joined'; playerId: string; username: string }
  | { type: 'player_left'; playerId: string }
  | { type: 'dice_rolled'; playerId: string; value: number }
  | { type: 'piece_moved'; playerId: string; pieceId: string; from: number; to: number }
  | { type: 'game_started'; game: GameState }
  | { type: 'game_over'; winner: string }
  | { type: 'error'; message: string }
  | { type: 'pong' };
