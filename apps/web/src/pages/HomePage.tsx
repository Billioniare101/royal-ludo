import { Link } from 'react-router-dom';

const programs = [
  ['01', 'Education first', 'Scholarships, mentorship, and learning spaces that help young people build a brighter future.'],
  ['02', 'Healthy communities', 'Practical wellness initiatives that make essential support more accessible to families.'],
  ['03', 'Local leaders', 'We equip community-led ideas with the resources and trust they need to create lasting change.'],
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-foundation-ink text-foundation-paper">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
        <Link to="/" className="flex items-center gap-3" aria-label="Dimedine Foundation home">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-foundation-coral text-xl font-black text-foundation-ink">D</span>
          <span className="font-serif text-lg font-bold tracking-tight">Dimedine Foundation</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold sm:gap-8">
          <a href="#our-work" className="hidden text-foundation-muted transition hover:text-white sm:block">Our work</a>
          <a href="#about" className="hidden text-foundation-muted transition hover:text-white md:block">About us</a>
          <a href="#contact" className="rounded-full bg-foundation-coral px-5 py-2.5 text-foundation-ink transition hover:bg-orange-300">Get involved</a>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:pb-32 lg:pt-24">
          <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-foundation-coral/10 blur-3xl" />
          <div className="relative z-10">
            <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-foundation-coral">
              <span className="h-px w-9 bg-foundation-coral" /> Change starts close to home
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl">
              Helping people
              <span className="block text-foundation-coral">shape what’s next.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-foundation-muted">
              Dimedine Foundation partners with communities to create opportunity, strengthen wellbeing, and turn good ideas into meaningful action.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#our-work" className="rounded-full bg-foundation-coral px-7 py-3.5 text-center font-bold text-foundation-ink transition hover:-translate-y-0.5 hover:bg-orange-300">Explore our work <span aria-hidden="true">→</span></a>
              <a href="#contact" className="rounded-full border border-white/20 px-7 py-3.5 text-center font-bold text-white transition hover:border-foundation-coral hover:text-foundation-coral">Support the mission</a>
            </div>
          </div>

          <div className="relative mx-auto h-[27rem] w-full max-w-md lg:h-[34rem]">
            <div className="absolute inset-5 rotate-6 rounded-[7rem_2rem_7rem_2rem] bg-foundation-sage/80" />
            <div className="absolute inset-0 overflow-hidden rounded-[2rem_7rem_2rem_7rem] border border-white/20 bg-foundation-sand shadow-2xl shadow-black/30">
              <div className="absolute -right-16 -top-12 h-52 w-52 rounded-full border-[28px] border-foundation-coral/70" />
              <div className="absolute bottom-0 left-0 h-44 w-full bg-foundation-sage/70" />
              <div className="absolute bottom-24 left-12 h-32 w-32 rounded-full bg-foundation-coral/90" />
              <div className="absolute bottom-28 right-10 h-44 w-24 -rotate-12 rounded-t-full bg-foundation-ink/90" />
              <div className="absolute bottom-24 right-16 h-24 w-14 -rotate-12 rounded-t-full bg-foundation-ink/90" />
              <div className="absolute left-8 top-12 max-w-[11rem] font-serif text-4xl font-bold leading-tight text-foundation-ink">Together, we grow.</div>
              <div className="absolute bottom-8 left-8 text-xs font-bold uppercase tracking-[0.22em] text-foundation-ink/70">People • Place • Possibility</div>
            </div>
          </div>
        </section>

        <section id="about" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-20">
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-foundation-coral">Our purpose</p><h2 className="mt-3 max-w-md font-serif text-4xl font-bold text-white">A foundation for the future we want to see.</h2></div>
            <div className="grid gap-8 sm:grid-cols-3">
              <div><p className="font-serif text-4xl font-bold text-foundation-coral">12k+</p><p className="mt-2 text-sm leading-6 text-foundation-muted">Lives touched through our community partners.</p></div>
              <div><p className="font-serif text-4xl font-bold text-foundation-coral">38</p><p className="mt-2 text-sm leading-6 text-foundation-muted">Local projects supported and growing.</p></div>
              <div><p className="font-serif text-4xl font-bold text-foundation-coral">100%</p><p className="mt-2 text-sm leading-6 text-foundation-muted">Committed to transparent, people-led impact.</p></div>
            </div>
          </div>
        </section>

        <section id="our-work" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-foundation-coral">What we do</p><h2 className="mt-3 font-serif text-4xl font-bold text-white">Small steps. Lasting impact.</h2></div>
            <p className="max-w-sm text-sm leading-6 text-foundation-muted">We focus on practical action, shared ownership, and outcomes that continue long after a project ends.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {programs.map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-foundation-coral/60">
                <p className="text-sm font-bold text-foundation-coral">{number}</p>
                <h3 className="mt-16 font-serif text-2xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-foundation-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-7 rounded-3xl bg-foundation-coral px-7 py-10 text-foundation-ink sm:px-12 lg:flex-row lg:items-center">
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] opacity-70">Be part of the story</p><h2 className="mt-2 font-serif text-3xl font-bold">There’s room for you here.</h2></div>
            <a href="mailto:hello@dimedinefoundation.org" className="rounded-full bg-foundation-ink px-6 py-3 font-bold text-white transition hover:bg-foundation-ink/80">Say hello <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-7 text-center text-sm text-foundation-muted sm:px-10 lg:px-12">
        <p>© 2026 Dimedine Foundation <span className="mx-2 opacity-40">•</span> Rooted in community.</p>
      </footer>
    </div>
  );
}
