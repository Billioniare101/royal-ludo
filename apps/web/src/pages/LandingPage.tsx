import { Link } from 'react-router-dom';

export function LandingPage(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="max-w-3xl rounded-3xl border border-royal-gold/30 bg-slate-900/80 p-10 text-center shadow-2xl shadow-royal-purple/20 backdrop-blur">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-royal-gold">Multiplayer strategy</p>
        <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">Royal Ludo</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Challenge friends in a modern real-time Ludo arena with room codes, live dice rolls, and an elegant royal board.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="rounded-full bg-royal-gold px-8 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Start Playing
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-slate-700 px-8 py-3 font-semibold text-white transition hover:border-royal-gold"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}
