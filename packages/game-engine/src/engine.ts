import type { Color, GameState, Player } from '@royal-ludo/shared';
import { rollDice } from './dice.js';
import { canMovePiece, checkCapture, movePiece } from './movement.js';
import { checkWinner, getNextPlayerIndex, isExtraTurn, validateMove } from './rules.js';

export function createInitialGameState(
  gameId: string,
  roomCode: string,
  players: Array<{ id: string; username: string; color: Color }>,
): GameState {
  const gamePlayers: Player[] = players.map((player) => ({
    id: player.id,
    username: player.username,
    color: player.color,
    isReady: true,
    pieces: [0, 1, 2, 3].map((index) => ({
      id: `${player.color}-${index}`,
      color: player.color,
      state: 'home' as const,
      position: -1,
    })),
  }));

  const now = new Date().toISOString();

  return {
    id: gameId,
    roomCode,
    status: 'playing',
    players: gamePlayers,
    currentPlayerIndex: 0,
    diceValue: null,
    diceRolled: false,
    winner: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function processRollDice(gameState: GameState, playerId: string): GameState {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer.id !== playerId) {
    throw new Error('Not your turn');
  }

  if (gameState.diceRolled) {
    throw new Error('Dice already rolled');
  }

  const value = rollDice();
  return {
    ...gameState,
    diceValue: value,
    diceRolled: true,
    updatedAt: new Date().toISOString(),
  };
}

export function processMovePiece(gameState: GameState, playerId: string, pieceId: string): GameState {
  const validation = validateMove(gameState, playerId, pieceId);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  const playerIndex = gameState.players.findIndex((player) => player.id === playerId);
  const player = gameState.players[playerIndex];
  const piece = player.pieces.find((candidate) => candidate.id === pieceId);
  const diceValue = gameState.diceValue;

  if (!piece || diceValue === null) {
    throw new Error('Invalid game state');
  }

  const allPieces = gameState.players.flatMap((candidate) => candidate.pieces);
  if (!canMovePiece(piece, diceValue, allPieces)) {
    throw new Error('Invalid move');
  }

  const movedPiece = movePiece(piece, diceValue);
  const allOtherPieces = gameState.players.flatMap((candidate) =>
    candidate.id === playerId ? [] : candidate.pieces,
  );
  const capturedPiece = checkCapture(movedPiece, allOtherPieces);

  const updatedPlayers = gameState.players.map((candidate) => {
    if (candidate.id === playerId) {
      return {
        ...candidate,
        pieces: candidate.pieces.map((existingPiece) => (existingPiece.id === pieceId ? movedPiece : existingPiece)),
      };
    }

    if (!capturedPiece) {
      return candidate;
    }

    return {
      ...candidate,
      pieces: candidate.pieces.map((existingPiece) =>
        existingPiece.id === capturedPiece.id ? { ...existingPiece, state: 'home' as const, position: -1 } : existingPiece,
      ),
    };
  });

  const winner = checkWinner(updatedPlayers);
  const extraTurn = isExtraTurn(diceValue, Boolean(capturedPiece));
  const nextPlayerIndex = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.players.length, extraTurn);

  return {
    ...gameState,
    players: updatedPlayers,
    currentPlayerIndex: nextPlayerIndex,
    diceValue: null,
    diceRolled: false,
    winner,
    status: winner ? 'finished' : 'playing',
    updatedAt: new Date().toISOString(),
  };
}
