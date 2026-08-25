import { GameState, Piece, PlayerColor } from '@royal-ludo/game-engine';

const COLOR_CLASSES: Record<PlayerColor, string> = {
  red: 'bg-red-500 border-red-700',
  blue: 'bg-blue-500 border-blue-700',
  yellow: 'bg-yellow-400 border-yellow-600',
  green: 'bg-green-500 border-green-700',
};

const SAFE_SQUARE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

interface Props {
  gameState: GameState;
  myColor: string | null;
  onPieceClick: (pieceId: string) => void;
}

export default function GameBoard({ gameState, myColor, onPieceClick }: Props) {
  const { pieces, legalMoves } = gameState;
  const legalPieceIds = new Set(legalMoves.map(m => m.pieceId));

  const boardPieces = pieces.filter(p => p.state === 'board');
  const yardPieces = pieces.filter(p => p.state === 'yard');
  const homePieces = pieces.filter(p => p.state === 'home');

  return (
    <div className="bg-purple-950 rounded-2xl p-4 border-2 border-royal-gold">
      {/* Board header */}
      <div className="flex justify-between mb-4">
        {gameState.players.map(color => {
          const playerPieces = pieces.filter(p => p.color === color);
          const homeCount = playerPieces.filter(p => p.state === 'home').length;
          return (
            <div key={color} className="text-center">
              <div className={`w-6 h-6 rounded-full mx-auto ${COLOR_CLASSES[color].split(' ')[0]} border-2 ${COLOR_CLASSES[color].split(' ')[1]}`} />
              <p className="text-xs mt-1 capitalize text-purple-300">{color}</p>
              <p className="text-xs text-royal-gold">{homeCount}/4</p>
            </div>
          );
        })}
      </div>

      {/* Board grid (simplified visual representation) */}
      <div className="grid grid-cols-11 gap-0.5 bg-purple-900 rounded-xl p-2">
        {Array.from({ length: 52 }).map((_, i) => {
          const piecesOnSquare = boardPieces.filter(p => p.position === i);
          const isSafe = SAFE_SQUARE_POSITIONS.includes(i);
          return (
            <div
              key={i}
              className={`aspect-square rounded flex items-center justify-center text-xs relative
                ${isSafe ? 'bg-yellow-900/40 ring-1 ring-royal-gold' : 'bg-purple-800/50'}
              `}
            >
              {isSafe && <span className="absolute text-royal-gold opacity-30 text-xs">★</span>}
              {piecesOnSquare.slice(0, 2).map(p => (
                <PieceDot key={p.id} piece={p} isLegal={legalPieceIds.has(p.id)} isMe={p.color === myColor} onClick={() => onPieceClick(p.id)} />
              ))}
            </div>
          );
        })}
      </div>

      {/* Yard area */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {gameState.players.map(color => {
          const inYard = yardPieces.filter(p => p.color === color);
          return (
            <div key={color} className="bg-purple-900/40 rounded-lg p-2">
              <p className="text-xs capitalize text-center text-purple-400 mb-1">{color} yard</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {inYard.map(p => (
                  <PieceDot key={p.id} piece={p} isLegal={legalPieceIds.has(p.id)} isMe={p.color === myColor} onClick={() => onPieceClick(p.id)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Home area */}
      <div className="mt-4 text-center">
        <p className="text-xs text-purple-400 mb-1">Home 🏠</p>
        <div className="flex flex-wrap gap-1 justify-center">
          {homePieces.map(p => (
            <div key={p.id} className={`w-5 h-5 rounded-full border-2 ${COLOR_CLASSES[p.color]}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface DotProps {
  piece: Piece;
  isLegal: boolean;
  isMe: boolean;
  onClick: () => void;
}

function PieceDot({ piece, isLegal, isMe, onClick }: DotProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isLegal}
      className={`w-4 h-4 rounded-full border-2 transition-transform
        ${COLOR_CLASSES[piece.color]}
        ${isLegal && isMe ? 'cursor-pointer scale-125 ring-2 ring-white animate-pulse' : ''}
        ${!isLegal ? 'cursor-default' : ''}
      `}
      title={`${piece.color} ${piece.id}${isLegal ? ' (click to move)' : ''}`}
    />
  );
}
