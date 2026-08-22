import type { Color, Piece } from '@royal-ludo/shared';

const TRACK_LENGTH = 52;
const FINAL_PATH = [53, 54, 55, 56, 57] as const;
const START_POSITIONS: Record<Color, number> = {
  red: 1,
  green: 14,
  blue: 27,
  yellow: 40,
};

function createColorPath(start: number): number[] {
  const track = Array.from({ length: TRACK_LENGTH }, (_, index) => ((start - 1 + index) % TRACK_LENGTH) + 1);
  return [...track, ...FINAL_PATH];
}

export const BOARD_PATHS: Record<Color, number[]> = {
  red: createColorPath(START_POSITIONS.red),
  green: createColorPath(START_POSITIONS.green),
  blue: createColorPath(START_POSITIONS.blue),
  yellow: createColorPath(START_POSITIONS.yellow),
};

export function getStartPosition(color: Color): number {
  return START_POSITIONS[color];
}

export function getSafeSquares(): number[] {
  return [1, 9, 14, 22, 27, 35, 40, 48];
}

export function isSafeSquare(position: number): boolean {
  return position > TRACK_LENGTH || getSafeSquares().includes(position);
}

export function canMovePiece(piece: Piece, diceValue: number, pieces: Piece[]): boolean {
  if (piece.state === 'finished') {
    return false;
  }

  if (piece.state === 'home') {
    if (diceValue !== 6) {
      return false;
    }
    const startPosition = getStartPosition(piece.color);
    return !pieces.some((candidate) => candidate.id !== piece.id && candidate.state === 'active' && candidate.position === startPosition);
  }

  const colorPath = BOARD_PATHS[piece.color];
  const currentIndex = colorPath.indexOf(piece.position);
  if (currentIndex === -1) {
    return false;
  }

  const nextIndex = currentIndex + diceValue;
  if (nextIndex >= colorPath.length) {
    return false;
  }

  const targetPosition = colorPath[nextIndex];
  return !pieces.some((candidate) => candidate.id !== piece.id && candidate.state !== 'home' && candidate.position === targetPosition);
}

export function movePiece(piece: Piece, diceValue: number): Piece {
  if (piece.state === 'home') {
    return {
      ...piece,
      state: 'active',
      position: getStartPosition(piece.color),
    };
  }

  const colorPath = BOARD_PATHS[piece.color];
  const currentIndex = colorPath.indexOf(piece.position);
  const nextPosition = colorPath[currentIndex + diceValue];

  if (nextPosition === 57) {
    return {
      ...piece,
      state: 'finished',
      position: 57,
    };
  }

  return {
    ...piece,
    state: 'active',
    position: nextPosition,
  };
}

export function checkCapture(movedPiece: Piece, allPieces: Piece[]): Piece | null {
  if (movedPiece.state !== 'active' || isSafeSquare(movedPiece.position)) {
    return null;
  }

  return (
    allPieces.find(
      (piece) =>
        piece.id !== movedPiece.id &&
        piece.color !== movedPiece.color &&
        piece.state === 'active' &&
        piece.position === movedPiece.position,
    ) ?? null
  );
}
