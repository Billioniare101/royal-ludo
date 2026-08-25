import { GameState, LegalMove, PlayerColor, Ruleset } from './types';
import { BOARD_LAYOUT, BOARD_LAYOUT_2P } from './rules';

export function getHomeStartPosition(color: PlayerColor, playerCount: 2 | 4): number {
  const layout = playerCount === 2 ? BOARD_LAYOUT_2P : BOARD_LAYOUT;
  return layout[color].home;
}

export function isSafeSquare(position: number, ruleset: Ruleset): boolean {
  return ruleset.safeSquares.includes(position % ruleset.boardSize);
}

/**
 * Check if player has captured at least one opponent piece in this turn.
 * Uses capturesThisTurn from current turn for efficiency.
 */
export function hasCapturedInCurrentTurn(state: GameState, playerColor: PlayerColor): boolean {
  if (!state.currentTurn || state.currentTurn.playerColor !== playerColor) return false;
  // Primary check: fast path via turn counter
  if (state.currentTurn.capturesThisTurn > 0) return true;
  // Fallback: check capture history for this turn (handles rehydrated state)
  return state.captureHistory.some(capture => {
    const capturingPiece = state.pieces.find(p => p.id === capture.capturedByPieceId);
    return (
      capturingPiece &&
      capturingPiece.color === playerColor &&
      capture.timestamp >= state.currentTurn!.startedAt
    );
  });
}

export function calculateLegalMoves(
  state: GameState,
  diceValue: number,
  currentPlayerColor: PlayerColor
): LegalMove[] {
  const moves: LegalMove[] = [];
  const ruleset = state.ruleset;
  const pieces = state.pieces.filter(p => p.color === currentPlayerColor);
  const playerHasCaptured = hasCapturedInCurrentTurn(state, currentPlayerColor);

  for (const piece of pieces) {
    if (piece.state === 'home') continue;

    if (piece.state === 'yard') {
      if (diceValue === 6) {
        const homeStart = getHomeStartPosition(currentPlayerColor, ruleset.playerCount);
        moves.push({
          fromPosition: -1,
          toPosition: homeStart,
          pieceId: piece.id,
          capturesOpponent: false,
          entersHome: false,
        });
      }
      continue;
    }

    if (piece.state === 'board') {
      const newPosition = piece.position + diceValue;
      const homeStart = getHomeStartPosition(currentPlayerColor, ruleset.playerCount);
      const homeEnd = homeStart + ruleset.homeSize;

      // RULE: Can only enter home if at least one opponent piece was captured this turn
      if (newPosition <= homeEnd && newPosition > homeStart) {
        if (!playerHasCaptured) {
          // Cannot enter home without capturing
          continue;
        }
        if (ruleset.exactRollRequired && newPosition !== homeEnd) {
          continue;
        }
        moves.push({
          fromPosition: piece.position,
          toPosition: newPosition,
          pieceId: piece.id,
          capturesOpponent: false,
          entersHome: newPosition === homeEnd,
        });
        continue;
      }

      if (newPosition < homeStart) {
        const hasOpponent = state.pieces.some(
          p => p.color !== currentPlayerColor && p.position === newPosition && p.state === 'board'
        );
        const capturesOpponent =
          ruleset.captureAllowed && !isSafeSquare(newPosition, ruleset) && hasOpponent;

        moves.push({
          fromPosition: piece.position,
          toPosition: newPosition,
          pieceId: piece.id,
          capturesOpponent,
          entersHome: false,
        });
      }
    }
  }

  return moves;
}

export function validateMove(
  state: GameState,
  pieceId: string,
  playerColor: PlayerColor
): { valid: boolean; reason?: string } {
  if (state.status !== 'active') {
    return { valid: false, reason: 'Game not active' };
  }
  if (state.currentTurn?.playerColor !== playerColor) {
    return { valid: false, reason: 'Not your turn' };
  }
  const piece = state.pieces.find(p => p.id === pieceId);
  if (!piece || piece.color !== playerColor) {
    return { valid: false, reason: 'Invalid piece' };
  }
  const legalMove = state.legalMoves.find(m => m.pieceId === pieceId);
  if (!legalMove) {
    return { valid: false, reason: 'Move not legal' };
  }
  return { valid: true };
}

export function allPiecesHome(state: GameState, playerColor: PlayerColor): boolean {
  const playerPieces = state.pieces.filter(p => p.color === playerColor);
  return playerPieces.every(p => p.state === 'home');
}
