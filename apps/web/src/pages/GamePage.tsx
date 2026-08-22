import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import GameBoard from '../components/GameBoard';
import DiceRoller from '../components/DiceRoller';

export default function GamePage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const { user } = useAuthStore();
  const { gameState, myColor, connect, disconnect, rollDice, movePiece } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomCode) return;
    const playerId = user?.id ?? `guest-${Math.random().toString(36).slice(2, 8)}`;
    connect(roomCode, playerId);
    return () => disconnect();
  }, [roomCode, user?.id]);

  if (!roomCode) {
    navigate('/lobby');
    return null;
  }

  const currentColor = gameState?.currentTurn?.playerColor;
  const isMyTurn = currentColor === myColor;
  const matchId = gameState?.id ?? '';
  const playerId = user?.id ?? 'guest';
  const lastDice =
    gameState?.currentTurn?.diceRolls[gameState.currentTurn.diceRolls.length - 1];

  return (
    <div className="min-h-screen bg-royal-dark flex flex-col items-center py-4">
      <header className="w-full max-w-2xl flex items-center justify-between px-4 mb-4">
        <h1 className="text-2xl font-bold text-royal-gold">👑 Royal Ludo</h1>
        <div className="text-purple-300 text-sm">Room: <span className="text-white font-mono font-bold">{roomCode}</span></div>
      </header>

      {gameState?.status === 'finished' ? (
        <div className="text-center space-y-4 mt-16">
          <p className="text-5xl">🏆</p>
          <h2 className="text-3xl font-bold text-royal-gold capitalize">{gameState.winner} wins!</h2>
          <button
            onClick={() => navigate('/lobby')}
            className="px-8 py-3 bg-royal-purple rounded-lg font-bold hover:bg-purple-700"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="w-full max-w-lg">
            {gameState ? (
              <GameBoard
                gameState={gameState}
                myColor={myColor}
                onPieceClick={(pieceId) => {
                  if (isMyTurn) movePiece(matchId, playerId, pieceId);
                }}
              />
            ) : (
              <div className="text-center py-20 text-purple-300">
                <div className="text-5xl mb-4">⏳</div>
                <p>Waiting for players...</p>
                <p className="font-mono text-royal-gold mt-2">{roomCode}</p>
              </div>
            )}
          </div>

          {gameState?.status === 'active' && (
            <div className="mt-4 space-y-2 text-center">
              <p className="text-purple-300">
                {isMyTurn ? (
                  <span className="text-royal-gold font-bold">Your turn! ({myColor})</span>
                ) : (
                  <span>Waiting for <span className="capitalize font-bold">{currentColor}</span>...</span>
                )}
              </p>
              <DiceRoller
                disabled={!isMyTurn || (gameState.legalMoves.length > 0)}
                lastRoll={lastDice}
                onRoll={() => rollDice(matchId, playerId)}
              />
              {gameState.currentTurn?.consecutiveSixes === 2 && (
                <p className="text-red-400 text-sm font-bold">⚠️ Warning: 3rd six will cancel your turn!</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
