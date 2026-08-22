import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (roomCode.trim()) navigate(`/game/${roomCode.trim().toUpperCase()}`);
  }

  async function handleCreate() {
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
        },
        body: JSON.stringify({ playerCount: '4' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? 'Failed to create room');
        return;
      }
      const { room } = (await res.json()) as { room: { code: string } };
      navigate(`/game/${room.code}`);
    } catch {
      setError('Network error — is the server running?');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-dark">
      <div className="space-y-8 text-center w-full max-w-md px-4">
        <h1 className="text-4xl font-bold text-royal-gold">👑 Royal Ludo</h1>
        <div className="bg-purple-900/40 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Join a Room</h2>
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              className="flex-1 bg-purple-900 rounded-lg px-4 py-2 text-white placeholder-purple-400 uppercase tracking-widest"
              placeholder="ROOM CODE"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-royal-gold text-black rounded-lg font-bold hover:bg-yellow-500"
            >
              Join
            </button>
          </form>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-royal-dark px-4 text-purple-400">or</span>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full py-3 bg-royal-purple text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create New Room'}
        </button>
      </div>
    </div>
  );
}
