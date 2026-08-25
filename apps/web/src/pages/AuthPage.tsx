import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' ? { email, password } : { email, password, username };
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed'); return; }
      setAuth(data.user, data.accessToken);
      navigate('/lobby');
    } catch {
      setError('Network error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-dark">
      <form onSubmit={submit} className="bg-purple-900/40 rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-3xl font-bold text-royal-gold text-center">
          {mode === 'login' ? 'Sign In' : 'Register'}
        </h2>
        {mode === 'register' && (
          <input
            className="w-full bg-purple-900 rounded-lg px-4 py-2 text-white placeholder-purple-400"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        )}
        <input
          className="w-full bg-purple-900 rounded-lg px-4 py-2 text-white placeholder-purple-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-purple-900 rounded-lg px-4 py-2 text-white placeholder-purple-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-royal-purple py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
        <p className="text-center text-purple-300 text-sm">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="text-royal-gold hover:underline"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </form>
    </div>
  );
}
