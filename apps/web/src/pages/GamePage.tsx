import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiceRoller } from '../components/DiceRoller.js';
import { GameBoard } from '../components/GameBoard.js';
import { PlayerList } from '../components/PlayerList.js';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { useAuthStore } from '../store/authStore.js';
import { useGameStore } from '../store/gameStore.js';
import { useWebSocketStore } from '../store/websocketStore.js';

export function GamePage(): JSX.Element {
  const navigate = useNavigate();
  const { roomCode = '' } = useParams();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const game = useGameStore((state) => state.game);
  const selectedPieceId = useGameStore((state) => state.selectedPieceId);
  const setSelectedPiece = useGameStore((state) => state.setSelectedPiece);
  const status = useWebSocketStore((state) => state.status);
  const send = useWebSocketStore((state) => state.send);
  const error = useGameStore((state) => state.error);

  useWebSocket(roomCode, token);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  const currentPlayer = game ? game.players[game.currentPlayerIndex] : undefined;
  const isUsersTurn = currentPlayer?.id === user?.id;

  function handleRollDice(): void {
    send({ type: 'roll_dice', roomCode });
  }

  function handlePieceClick(pieceId: string): void {
    setSelectedPiece(pieceId);
    if (isUsersTurn && game?.diceRolled) {
      send({ type: 'move_piece', roomCode, pieceId });
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-royal-gold">Room {roomCode}</p>
          <h1 className="text-4xl font-bold text-white">Royal Match</h1>
        </div>
        <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          Connection: <span className="font-semibold text-white">{status}</span>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <GameBoard game={game} selectedPieceId={selectedPieceId} onPieceClick={handlePieceClick} />
        <aside className="space-y-6">
          <DiceRoller
            value={game?.diceValue ?? null}
            canRoll={Boolean(isUsersTurn && game && !game.diceRolled && game.status === 'playing')}
            onRoll={handleRollDice}
          />
          <PlayerList players={game?.players ?? []} currentPlayerId={currentPlayer?.id ?? null} />
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="text-lg font-semibold text-white">Turn status</h2>
            <p className="mt-3 text-sm text-slate-300">
              {game?.winner
                ? `Winner: ${game.players.find((player) => player.id === game.winner)?.username ?? game.winner}`
                : isUsersTurn
                  ? 'Your move. Roll the dice or move a piece.'
                  : `${currentPlayer?.username ?? 'Waiting for players'} is taking their turn.`}
            </p>
            {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
          </section>
        </aside>
      </div>
    </main>
  );
}
