import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client.js';
import { useGameStore } from '../store/gameStore.js';

export function LobbyPage(): JSX.Element {
  const navigate = useNavigate();
  const setGame = useGameStore((state) => state.setGame);
  const [roomCode, setRoomCode] = useState('');
  const [message, setMessage] = useState('');
  const [loadingAction, setLoadingAction] = useState<'create' | 'join' | null>(null);

  async function createRoom(): Promise<void> {
    setLoadingAction('create');
    setMessage('');
    try {
      const response = await apiClient.post('/rooms', { maxPlayers: 4 });
      setGame(response.data.room.game);
      navigate(`/game/${response.data.room.code}`);
    } catch {
      setMessage('Could not create a room right now.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function joinRoom(): Promise<void> {
    setLoadingAction('join');
    setMessage('');
    try {
      const response = await apiClient.post(`/rooms/${roomCode.toUpperCase()}/join`);
      setGame(response.data.room.game);
      navigate(`/game/${response.data.room.code}`);
    } catch {
      setMessage('That room is unavailable. Double-check the code.');
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-4xl font-bold text-white">Game Lobby</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Create a private room or join your friends using a six-character code.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <h2 className="text-xl font-semibold text-white">Create a room</h2>
            <p className="mt-2 text-sm text-slate-400">Become the host and invite up to three challengers.</p>
            <button
              type="button"
              onClick={() => void createRoom()}
              disabled={loadingAction !== null}
              className="mt-6 rounded-xl bg-royal-gold px-5 py-3 font-semibold text-slate-950 disabled:opacity-60"
            >
              {loadingAction === 'create' ? 'Creating…' : 'Create Room'}
            </button>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <h2 className="text-xl font-semibold text-white">Join a room</h2>
            <p className="mt-2 text-sm text-slate-400">Enter a room code shared by a host.</p>
            <input
              type="text"
              maxLength={6}
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              placeholder="ABC123"
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 uppercase tracking-[0.4em] text-white outline-none focus:border-royal-gold"
            />
            <button
              type="button"
              onClick={() => void joinRoom()}
              disabled={loadingAction !== null || roomCode.length !== 6}
              className="mt-4 rounded-xl border border-royal-gold px-5 py-3 font-semibold text-royal-gold disabled:opacity-50"
            >
              {loadingAction === 'join' ? 'Joining…' : 'Join Room'}
            </button>
          </section>
        </div>
        {message ? <p className="mt-6 text-sm text-red-400">{message}</p> : null}
      </div>
    </main>
  );
}
