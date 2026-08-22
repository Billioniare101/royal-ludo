export type Color = 'red' | 'green' | 'blue' | 'yellow';
export type PieceState = 'home' | 'active' | 'finished';

export interface Piece {
  id: string;
  color: Color;
  state: PieceState;
  position: number;
}

export interface Player {
  id: string;
  username: string;
  color: Color;
  pieces: Piece[];
  isReady: boolean;
}

export type GameStatus = 'waiting' | 'playing' | 'finished';

export interface GameState {
  id: string;
  roomCode: string;
  status: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  diceRolled: boolean;
  winner: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  code: string;
  hostId: string;
  game: GameState;
  maxPlayers: number;
}
