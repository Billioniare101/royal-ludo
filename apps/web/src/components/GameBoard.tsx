import clsx from 'clsx';
import type { GameState, Piece } from '@royal-ludo/shared';

interface GameBoardProps {
  game: GameState | null;
  selectedPieceId: string | null;
  onPieceClick: (pieceId: string) => void;
}

const CELL_SIZE = 32;
const BOARD_SIZE = 15 * CELL_SIZE;

const trackCoordinates = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 7], [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7],
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0],
] as const;

const finishCoordinates: Record<string, Array<[number, number]>> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
  blue: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
};

const homeCoordinates: Record<string, Array<[number, number]>> = {
  red: [[2, 2], [4, 2], [2, 4], [4, 4]],
  green: [[10, 2], [12, 2], [10, 4], [12, 4]],
  blue: [[2, 10], [4, 10], [2, 12], [4, 12]],
  yellow: [[10, 10], [12, 10], [10, 12], [12, 12]],
};

const pieceColorClass: Record<Piece['color'], string> = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#eab308',
};

function getPieceCoordinate(piece: Piece, index: number): [number, number] {
  if (piece.state === 'home') {
    return homeCoordinates[piece.color][index % 4];
  }

  if (piece.position >= 53) {
    return finishCoordinates[piece.color][Math.min(piece.position - 53, 4)];
  }

  const coordinate = trackCoordinates[piece.position - 1] ?? trackCoordinates[0];
  return [coordinate[0], coordinate[1]];
}

function renderZone(x: number, y: number, color: string): JSX.Element {
  return <rect x={x * CELL_SIZE} y={y * CELL_SIZE} width={CELL_SIZE * 6} height={CELL_SIZE * 6} fill={color} opacity={0.25} rx={18} />;
}

export function GameBoard({ game, selectedPieceId, onPieceClick }: GameBoardProps): JSX.Element {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Board</h2>
          <p className="text-sm text-slate-400">Select a piece to move after rolling the dice.</p>
        </div>
      </div>
      <svg viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`} className="mx-auto w-full max-w-[640px] rounded-2xl bg-slate-100">
        {renderZone(0, 0, '#ef4444')}
        {renderZone(9, 0, '#22c55e')}
        {renderZone(0, 9, '#3b82f6')}
        {renderZone(9, 9, '#eab308')}
        <rect x={CELL_SIZE * 6} y={CELL_SIZE * 6} width={CELL_SIZE * 3} height={CELL_SIZE * 3} fill="#4B0082" opacity={0.2} />
        {Array.from({ length: 15 }, (_, row) =>
          Array.from({ length: 15 }, (_, column) => (
            <rect
              key={`${row}-${column}`}
              x={column * CELL_SIZE}
              y={row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="transparent"
              stroke="#cbd5e1"
              strokeOpacity={0.35}
            />
          )),
        )}
        {trackCoordinates.map(([x, y], index) => (
          <rect
            key={`track-${index + 1}`}
            x={x * CELL_SIZE}
            y={y * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#ffffff"
            stroke="#94a3b8"
          />
        ))}
        {Object.entries(finishCoordinates).flatMap(([color, coordinates]) =>
          coordinates.map(([x, y], index) => (
            <rect
              key={`${color}-finish-${index}`}
              x={x * CELL_SIZE}
              y={y * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={pieceColorClass[color as Piece['color']]}
              opacity={0.35}
            />
          )),
        )}
        {game?.players.flatMap((player) =>
          player.pieces.map((piece, index) => {
            const [x, y] = getPieceCoordinate(piece, index);
            const isSelected = selectedPieceId === piece.id;
            return (
              <g key={piece.id} onClick={() => onPieceClick(piece.id)} className={clsx('cursor-pointer', isSelected && 'drop-shadow-lg')}>
                <circle
                  cx={x * CELL_SIZE + CELL_SIZE / 2}
                  cy={y * CELL_SIZE + CELL_SIZE / 2}
                  r={CELL_SIZE * 0.32}
                  fill={pieceColorClass[piece.color]}
                  stroke={isSelected ? '#111827' : '#f8fafc'}
                  strokeWidth={isSelected ? 4 : 2}
                />
                <text
                  x={x * CELL_SIZE + CELL_SIZE / 2}
                  y={y * CELL_SIZE + CELL_SIZE / 2 + 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#ffffff"
                >
                  {index + 1}
                </text>
              </g>
            );
          }),
        )}
      </svg>
    </section>
  );
}
