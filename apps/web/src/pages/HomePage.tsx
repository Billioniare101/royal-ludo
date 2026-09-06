import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-royal-dark">
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between py-7">
          <Link to="/" className="flex items-center gap-3" aria-label="Royal Ludo home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-royal-gold/40 bg-royal-gold/10 text-xl shadow-lg shadow-royal-gold/10">
              ♛
            </span>
            <span className="text-lg font-black tracking-[0.18em] text-white">ROYAL LUDO</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-semibold sm:gap-7">
            <a href="#how-to-play" className="hidden text-purple-200 transition hover:text-white sm:block">
              How to play
            </a>
            <Link to="/auth" className="rounded-full border border-purple-400/40 px-4 py-2 text-purple-100 transition hover:border-royal-gold hover:text-royal-gold">
              Sign in
            </Link>
          </nav>
        </header>

        <main>
          <section className="relative grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-20">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-royal-gold">
                <span className="h-px w-8 bg-royal-gold" />
                The game of kings
              </p>
              <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-7xl">
                Roll the dice.
                <span className="block text-royal-gold">Rule the board.</span>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-purple-200">
                A modern multiplayer Ludo experience where clever moves, lucky rolls, and friendly rivalries make every match legendary.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/lobby" className="rounded-xl bg-royal-gold px-7 py-3.5 text-center font-extrabold text-royal-dark shadow-xl shadow-royal-gold/20 transition hover:-translate-y-0.5 hover:bg-yellow-300">
                  Play a match <span aria-hidden="true">→</span>
                </Link>
                <Link to="/auth" className="rounded-xl border border-purple-400/40 bg-white/5 px-7 py-3.5 text-center font-bold text-white transition hover:border-purple-200 hover:bg-white/10">
                  Create an account
                </Link>
              </div>
              <div className="mt-12 flex gap-8 border-t border-white/10 pt-6">
                <div><p className="text-2xl font-black text-white">2–4</p><p className="text-sm text-purple-300">players per match</p></div>
                <div><p className="text-2xl font-black text-white">∞</p><p className="text-sm text-purple-300">reasons to rematch</p></div>
                <div><p className="text-2xl font-black text-white">24/7</p><p className="text-sm text-purple-300">royal competition</p></div>
              </div>
            </div>

            <div className="relative mx-auto h-[23rem] w-full max-w-md lg:h-[31rem]">
              <div className="absolute inset-8 rotate-6 rounded-[2.5rem] border border-royal-gold/30 bg-purple-900/30 shadow-2xl shadow-black/40 backdrop-blur-sm" />
              <div className="absolute inset-0 flex rotate-[-4deg] items-center justify-center rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-purple-800 via-purple-950 to-royal-dark p-5 shadow-2xl shadow-purple-950/70">
                <div className="grid aspect-square w-full max-w-[20rem] grid-cols-3 grid-rows-3 gap-2 rounded-2xl border-4 border-royal-gold/80 bg-royal-gold/10 p-2 shadow-inner shadow-royal-gold/10">
                  <div className="rounded-xl bg-[#dc2626]" /><div className="rounded-xl bg-[#dc2626]" /><div className="rounded-xl bg-[#f8fafc]" />
                  <div className="rounded-xl bg-[#dc2626]" /><div className="grid place-items-center rounded-xl bg-royal-gold text-4xl font-black text-royal-dark">♛</div><div className="rounded-xl bg-[#2563eb]" />
                  <div className="rounded-xl bg-[#f8fafc]" /><div className="rounded-xl bg-[#22c55e]" /><div className="rounded-xl bg-[#2563eb]" />
                </div>
              </div>
              <div className="absolute -bottom-3 -left-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-md">
                <span className="mr-2 text-royal-gold">●</span> Your turn
              </div>
              <div className="absolute -right-2 top-8 rounded-2xl border border-royal-gold/30 bg-royal-dark/80 px-4 py-3 text-sm font-bold text-purple-100 shadow-xl backdrop-blur-md">
                <span className="mr-2 text-royal-gold">✦</span> Play your way
              </div>
            </div>
          </section>

          <section id="how-to-play" className="border-t border-white/10 py-16 lg:py-20">
            <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-royal-gold">Built for the table</p><h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Every roll tells a story.</h2></div>
              <p className="max-w-sm text-sm leading-6 text-purple-300">Fast to learn, satisfying to master, and always better with friends.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['01', 'Gather your crew', 'Invite friends to a private room or jump straight into the lobby for a quick match.'],
                ['02', 'Make your move', 'Use smart strategy and a little luck to race every token safely around the board.'],
                ['03', 'Claim the crown', 'Capture opponents, reach home, and take your place at the top of the leaderboard.'],
              ].map(([number, title, description]) => (
                <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-royal-gold/40">
                  <p className="text-sm font-black text-royal-gold">{number}</p>
                  <h3 className="mt-10 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-purple-300">{description}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-purple-400 sm:px-10 lg:px-12">
        <p>Royal Ludo <span className="mx-2 text-purple-700">•</span> Bring your best game.</p>
      </footer>
    </div>
  );
}
