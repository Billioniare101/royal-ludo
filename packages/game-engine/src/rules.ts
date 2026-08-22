import { PlayerColor, Ruleset } from './types';

export const DEFAULT_RULESET_4P: Ruleset = {
  playerCount: 4,
  boardSize: 52,
  homeSize: 6,
  safeSquares: [0, 8, 13, 21, 26, 34, 39, 47], // standard safe squares
  captureAllowed: true,
  exactRollRequired: true,
  piecesPerPlayer: 4,
};

export const DEFAULT_RULESET_2P: Ruleset = {
  playerCount: 2,
  boardSize: 52,
  homeSize: 6,
  safeSquares: [0, 8, 13, 21, 26, 34, 39, 47],
  captureAllowed: true,
  exactRollRequired: true,
  piecesPerPlayer: 4,
};

// Each color's home start position (first square of the home column)
export const HOME_START: Record<PlayerColor, number> = {
  red: 51,
  blue: 12,
  yellow: 25,
  green: 38,
};

// Board start position (first square after yard, index on main track)
export const BOARD_START: Record<PlayerColor, number> = {
  red: 0,
  blue: 13,
  yellow: 26,
  green: 39,
};

// Layout used by 4P game
export const BOARD_LAYOUT: Record<PlayerColor, { home: number; start: number }> = {
  red: { home: 51, start: 0 },
  blue: { home: 12, start: 13 },
  yellow: { home: 25, start: 26 },
  green: { home: 38, start: 39 },
};

// Layout used by 2P game (only red and yellow; blue and green are unused placeholders)
export const BOARD_LAYOUT_2P: Record<PlayerColor, { home: number; start: number }> = {
  red: { home: 51, start: 0 },
  blue: { home: 12, start: 13 }, // unused in 2P
  yellow: { home: 25, start: 26 },
  green: { home: 38, start: 39 }, // unused in 2P
};

export const MAX_CONSECUTIVE_SIXES = 3;
