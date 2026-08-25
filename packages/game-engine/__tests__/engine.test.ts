import { describe, it, expect } from 'vitest';
import { createInitialState, startGame, rollDice, applyMove } from '../src/engine';
import { calculateLegalMoves, isSafeSquare } from '../src/validate';

const FOUR_PLAYERS = ['red', 'blue', 'yellow', 'green'] as const;

function getActive4pState() {
  const state = createInitialState([...FOUR_PLAYERS], 4);
  return startGame(state);
}

describe('Game Engine - Initialization', () => {
  it('creates pieces in yard', () => {
    const state = createInitialState(['red', 'blue', 'yellow', 'green'], 4);
    expect(state.pieces.length).toBe(16);
    expect(state.pieces.every(p => p.state === 'yard')).toBe(true);
  });

  it('starts with status waiting', () => {
    const state = createInitialState(['red', 'blue', 'yellow', 'green'], 4);
    expect(state.status).toBe('waiting');
  });

  it('startGame sets status to active', () => {
    const s = getActive4pState();
    expect(s.status).toBe('active');
    expect(s.currentTurn?.playerColor).toBe('red');
  });
});

describe('Game Engine - Three Consecutive Sixes Rule', () => {
  it('ends turn on third consecutive 6', () => {
    let state = getActive4pState();
    // Roll 6 three times
    state = rollDice(state, 6);
    expect(state.currentTurn?.playerColor).toBe('red');
    // Pick any piece (all in yard, so no legal moves from board)
    // But we need to simulate applyMove won't be called when no moves
    // Roll second 6 - need to first "use" the roll
    // Since all pieces are in yard and we rolled 6, there IS a legal move
    const move1 = state.legalMoves[0];
    state = applyMove(state, move1.pieceId);
    // Now rolling again (bonus for 6)
    state = rollDice(state, 6);
    const move2 = state.legalMoves[0];
    state = applyMove(state, move2.pieceId);
    // Third 6 - turn should be cancelled
    state = rollDice(state, 6);
    // Turn should advance to blue (consecutiveSixes === 3)
    expect(state.currentTurn?.playerColor).toBe('blue');
  });

  it('resets consecutive sixes count on non-6 roll', () => {
    let state = getActive4pState();
    state = rollDice(state, 6);
    const move = state.legalMoves[0];
    state = applyMove(state, move.pieceId);
    // Roll non-6 — consecutive sixes resets
    state = rollDice(state, 3);
    expect(state.currentTurn?.consecutiveSixes).toBe(0);
  });
});

describe('Game Engine - Win-Home Rule', () => {
  it('prevents piece from entering home without a capture', () => {
    let state = getActive4pState();
    // Place piece at homeStart (51) so dice=6 gives exact homeEnd (57)
    state = {
      ...state,
      pieces: state.pieces.map((p, i) =>
        p.color === 'red' && i === 0
          ? { ...p, state: 'board', position: 51 }
          : p
      ),
    };
    // No captures this turn (capturesThisTurn defaults to 0)
    const moves = calculateLegalMoves(state, 6, 'red');
    const homeMove = moves.find(m => m.entersHome);
    // Should NOT have a home entry move because no captures
    expect(homeMove).toBeUndefined();
  });

  it('allows home entry after a capture', () => {
    let state = getActive4pState();
    // Place piece at homeStart (51) so dice=6 gives exact homeEnd (57)
    const redPiece = state.pieces.find(p => p.color === 'red')!;
    state = {
      ...state,
      pieces: state.pieces.map(p =>
        p.id === redPiece.id ? { ...p, state: 'board', position: 51 } : p
      ),
      // Simulate a capture this turn
      currentTurn: {
        ...state.currentTurn!,
        capturesThisTurn: 1,
      },
      captureHistory: [
        {
          capturedByPieceId: redPiece.id,
          capturedPieceId: 'blue-0',
          timestamp: state.currentTurn!.startedAt + 1,
        },
      ],
    };
    const moves = calculateLegalMoves(state, 6, 'red');
    const homeMove = moves.find(m => m.entersHome);
    expect(homeMove).toBeDefined();
  });
});

describe('Game Engine - Safe Squares', () => {
  it('cannot capture piece on safe square', () => {
    let state = getActive4pState();
    const redPiece = state.pieces.find(p => p.color === 'red')!;
    const bluePiece = state.pieces.find(p => p.color === 'blue')!;
    // Place blue on safe square 8
    state = {
      ...state,
      pieces: state.pieces.map(p => {
        if (p.id === redPiece.id) return { ...p, state: 'board', position: 7 };
        if (p.id === bluePiece.id) return { ...p, state: 'board', position: 8 };
        return p;
      }),
    };
    const moves = calculateLegalMoves(state, 1, 'red');
    const capture = moves.find(m => m.capturesOpponent && m.toPosition === 8);
    expect(capture).toBeUndefined();
  });
});

describe('Game Engine - Exact Roll Required', () => {
  it('does not allow home entry unless exact roll', () => {
    let state = getActive4pState();
    const redPiece = state.pieces.find(p => p.color === 'red')!;
    // Piece in home column at position 52, dice=4 → 56 ≠ homeEnd (57)
    state = {
      ...state,
      pieces: state.pieces.map(p =>
        p.id === redPiece.id ? { ...p, state: 'board', position: 52 } : p
      ),
      currentTurn: {
        ...state.currentTurn!,
        capturesThisTurn: 1,
      },
      captureHistory: [
        {
          capturedByPieceId: redPiece.id,
          capturedPieceId: 'blue-0',
          timestamp: state.currentTurn!.startedAt + 1,
        },
      ],
    };
    // homeEnd = homeStart + homeSize = 51 + 6 = 57
    // Position 52, roll 4 => 56, not homeEnd (57)
    const moves = calculateLegalMoves(state, 4, 'red');
    const homeMove = moves.find(m => m.entersHome);
    expect(homeMove).toBeUndefined();
  });
});
