import { GameState, Piece, PlayerColor, Turn, LegalMove, CaptureEvent } from './types';
import { DEFAULT_RULESET_4P, DEFAULT_RULESET_2P, BOARD_LAYOUT, MAX_CONSECUTIVE_SIXES } from './rules';
import { calculateLegalMoves, allPiecesHome } from './validate';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createInitialState(players: PlayerColor[], playerCount: 2 | 4 = 4): GameState {
  const ruleset = playerCount === 2 ? DEFAULT_RULESET_2P : DEFAULT_RULESET_4P;
  const pieces: Piece[] = [];

  for (const color of players) {
    for (let i = 0; i < ruleset.piecesPerPlayer; i++) {
      pieces.push({
        id: `${color}-${i}`,
        color,
        state: 'yard',
        position: -1,
      });
    }
  }

  return {
    id: generateId(),
    status: 'waiting',
    players,
    pieces,
    currentTurn: null,
    captureHistory: [],
    legalMoves: [],
    ruleset,
    winner: null,
  };
}

export function startGame(state: GameState): GameState {
  if (state.status !== 'waiting') return state;
  const firstPlayer = state.players[0];
  const now = Date.now();
  const newTurn: Turn = {
    playerColor: firstPlayer,
    startedAt: now,
    diceRolls: [],
    consecutiveSixes: 0,
    capturesThisTurn: 0,
  };
  return {
    ...state,
    status: 'active',
    currentTurn: newTurn,
    legalMoves: [],
  };
}

/**
 * Roll dice — returns new state with legal moves computed.
 * Enforces: 3 consecutive sixes ends the turn immediately.
 */
export function rollDice(state: GameState, diceValue: number): GameState {
  if (state.status !== 'active' || !state.currentTurn) return state;

  const turn = state.currentTurn;
  const newConsecutiveSixes = diceValue === 6 ? turn.consecutiveSixes + 1 : 0;

  // RULE: Three consecutive 6s cancels the turn immediately
  if (newConsecutiveSixes >= MAX_CONSECUTIVE_SIXES) {
    return advanceTurn({
      ...state,
      currentTurn: {
        ...turn,
        diceRolls: [...turn.diceRolls, diceValue],
        consecutiveSixes: newConsecutiveSixes,
      },
      legalMoves: [],
    });
  }

  const updatedTurn: Turn = {
    ...turn,
    diceRolls: [...turn.diceRolls, diceValue],
    consecutiveSixes: newConsecutiveSixes,
  };

  const legalMoves = calculateLegalMoves(
    { ...state, currentTurn: updatedTurn },
    diceValue,
    turn.playerColor
  );

  return {
    ...state,
    currentTurn: updatedTurn,
    legalMoves,
  };
}

/**
 * Apply a move. Returns updated state.
 */
export function applyMove(state: GameState, pieceId: string): GameState {
  if (state.status !== 'active' || !state.currentTurn) return state;

  const move: LegalMove | undefined = state.legalMoves.find(m => m.pieceId === pieceId);
  if (!move) return state;

  let pieces = [...state.pieces];
  let captureHistory = [...state.captureHistory];
  let capturesThisTurn = state.currentTurn.capturesThisTurn;

  // Handle capture
  if (move.capturesOpponent) {
    const capturedPiece = pieces.find(
      p => p.color !== state.currentTurn!.playerColor &&
        p.position === move.toPosition &&
        p.state === 'board'
    );
    if (capturedPiece) {
      const captureEvent: CaptureEvent = {
        capturedByPieceId: pieceId,
        capturedPieceId: capturedPiece.id,
        timestamp: Date.now(),
      };
      captureHistory = [...captureHistory, captureEvent];
      capturesThisTurn += 1;
      pieces = pieces.map(p =>
        p.id === capturedPiece.id ? { ...p, state: 'yard', position: -1 } : p
      );
    }
  }

  // Move the piece
  pieces = pieces.map(p => {
    if (p.id !== pieceId) return p;
    if (move.entersHome) {
      return { ...p, state: 'home', position: move.toPosition };
    }
    if (move.fromPosition === -1) {
      return { ...p, state: 'board', position: move.toPosition };
    }
    return { ...p, position: move.toPosition };
  });

  const updatedTurn: Turn = {
    ...state.currentTurn,
    capturesThisTurn,
  };

  let newState: GameState = {
    ...state,
    pieces,
    captureHistory,
    currentTurn: updatedTurn,
    legalMoves: [],
  };

  // Check win condition
  if (allPiecesHome(newState, updatedTurn.playerColor)) {
    return { ...newState, status: 'finished', winner: updatedTurn.playerColor, currentTurn: null };
  }

  // Rolling 6 grants another roll (unless we already handled 3-sixes)
  const lastRoll = updatedTurn.diceRolls[updatedTurn.diceRolls.length - 1];
  if (lastRoll === 6) {
    // Grant extra turn but reset consecutive sixes tracker for capture/move state
    return {
      ...newState,
      currentTurn: {
        ...updatedTurn,
        diceRolls: [], // reset for next roll
        consecutiveSixes: updatedTurn.consecutiveSixes,
      },
    };
  }

  // Advance to next player
  return advanceTurn(newState);
}

function advanceTurn(state: GameState): GameState {
  if (!state.currentTurn) return state;
  const currentIndex = state.players.indexOf(state.currentTurn.playerColor);
  const nextIndex = (currentIndex + 1) % state.players.length;
  const nextPlayer = state.players[nextIndex];
  const now = Date.now();

  return {
    ...state,
    currentTurn: {
      playerColor: nextPlayer,
      startedAt: now,
      diceRolls: [],
      consecutiveSixes: 0,
      capturesThisTurn: 0,
    },
    legalMoves: [],
  };
}
