interface Props {
  disabled: boolean;
  lastRoll: number | undefined;
  onRoll: () => void;
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function DiceRoller({ disabled, lastRoll, onRoll }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      {lastRoll !== undefined && (
        <span className="text-5xl">{DICE_FACES[lastRoll - 1]}</span>
      )}
      <button
        onClick={onRoll}
        disabled={disabled}
        className="px-8 py-3 bg-royal-gold text-black font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Roll Dice
      </button>
    </div>
  );
}
