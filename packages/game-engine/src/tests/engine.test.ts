import { describe, expect, it, vi } from 'vitest';
import { createInitialGameState, processRollDice } from '../engine.js';

describe('game engine', () => {
  const players = [
    { id: 'player-1', username: 'Alice', color: 'red' as const },
    { id: 'player-2', username: 'Bob', color: 'green' as const },
  ];

  it('createInitialGameState creates correct structure', () => {
    const gameState = createInitialGameState('game-1', 'ABC123', players);

    expect(gameState.id).toBe('game-1');
    expect(gameState.roomCode).toBe('ABC123');
    expect(gameState.status).toBe('playing');
    expect(gameState.players).toHaveLength(2);
    expect(gameState.players[0].pieces).toHaveLength(4);
    expect(gameState.players[0].pieces.every((piece) => piece.position === -1)).toBe(true);
  });

  it('processRollDice throws on wrong player turn', () => {
    const gameState = createInitialGameState('game-1', 'ABC123', players);

    expect(() => processRollDice(gameState, 'player-2')).toThrow('Not your turn');
  });

  it('processRollDice sets diceValue and diceRolled', () => {
    const gameState = createInitialGameState('game-1', 'ABC123', players);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const updatedGameState = processRollDice(gameState, 'player-1');

    expect(updatedGameState.diceValue).toBe(4);
    expect(updatedGameState.diceRolled).toBe(true);
    vi.restoreAllMocks();
  });
});
