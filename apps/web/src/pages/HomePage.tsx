import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-royal-dark">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-royal-gold">👑 Royal Ludo</h1>
        <p className="text-xl text-purple-300">The ultimate multiplayer Ludo experience</p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/auth"
            className="px-8 py-3 bg-royal-purple text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/lobby"
            className="px-8 py-3 bg-royal-gold text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Play Now
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-purple-300">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="font-bold text-royal-gold">Win-Home Rule</p>
            <p>Must capture an opponent to enter home</p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="font-bold text-royal-gold">Three Sixes Rule</p>
            <p>3 consecutive 6s cancels your turn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
