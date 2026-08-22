interface DiceRollerProps {
  value: number | null;
  canRoll: boolean;
  onRoll: () => void;
}

export function DiceRoller({ value, canRoll, onRoll }: DiceRollerProps): JSX.Element {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <h2 className="text-lg font-semibold text-white">Dice</h2>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-4xl font-black text-royal-gold">
          {value ?? '–'}
        </div>
        <button
          type="button"
          onClick={onRoll}
          disabled={!canRoll}
          className="rounded-xl bg-royal-crimson px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Roll Dice
        </button>
      </div>
    </section>
  );
}
