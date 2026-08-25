export type PlayerColor = 'red' | 'blue' | 'yellow' | 'green';

export type PieceState = 'yard' | 'board' | 'home';

export interface Piece {
  id: string;
  color: PlayerColor;
  state: PieceState;
  position: number; // -1 if in yard, absolute position on board, homeEnd if home
}

export interface CaptureEvent {
  capturedByPieceId: string;
  capturedPieceId: string;
  timestamp: number;
}

export interface Turn {
  playerColor: PlayerColor;
  startedAt: number;
  diceRolls: number[];
  consecutiveSixes: number;
  capturesThisTurn: number;
}

export interface LegalMove {
  pieceId: string;
  fromPosition: number;
  toPosition: number;
  capturesOpponent: boolean;
  entersHome: boolean;
}

export type GameStatus = 'waiting' | 'active' | 'finished';

export interface Ruleset {
  playerCount: 2 | 4;
  boardSize: number;
  homeSize: number;
  safeSquares: number[];
  captureAllowed: boolean;
  exactRollRequired: boolean;
  piecesPerPlayer: number;
}

export interface GameState {
  id: string;
  status: GameStatus;
  players: PlayerColor[];
  pieces: Piece[];
  currentTurn: Turn | null;
  captureHistory: CaptureEvent[];
  legalMoves: LegalMove[];
  ruleset: Ruleset;
  winner: PlayerColor | null;
}
