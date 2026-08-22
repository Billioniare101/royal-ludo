import type { GameState, Player } from '@royal-ludo/shared';
import { canMovePiece } from './movement.js';

export function canEnterBoard(diceValue: number): boolean {
  return diceValue === 6;
}

export function isExtraTurn(diceValue: number, captured: boolean): boolean {
  return diceValue === 6 || captured;
}

export function getNextPlayerIndex(current: number, total: number, extraTurn: boolean): number {
  return extraTurn ? current : (current + 1) % total;
}

export function checkWinner(players: Player[]): string | null {
  const winner = players.find((player) => player.pieces.every((piece) => piece.state === 'finished'));
  return winner?.id ?? null;
}

export function validateMove(
  gameState: GameState,
  playerId: string,
  pieceId: string,
): { valid: true } | { valid: false; reason: string } {
  if (gameState.status !== 'playing') {
    return { valid: false, reason: 'Game is not in progress' };
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer?.id !== playerId) {
    return { valid: false, reason: 'Not your turn' };
  }

  if (!gameState.diceRolled || gameState.diceValue === null) {
    return { valid: false, reason: 'Roll the dice first' };
  }

  const player = gameState.players.find((candidate) => candidate.id === playerId);
  if (!player) {
    return { valid: false, reason: 'Player not found' };
  }

  const piece = player.pieces.find((candidate) => candidate.id === pieceId);
  if (!piece) {
    return { valid: false, reason: 'Piece not found' };
  }

  const allPieces = gameState.players.flatMap((candidate) => candidate.pieces);
  if (!canMovePiece(piece, gameState.diceValue, allPieces)) {
    return { valid: false, reason: 'Invalid move' };
  }

  return { valid: true };
}
