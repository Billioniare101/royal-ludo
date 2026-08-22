import type { Player } from '@royal-ludo/shared';

const playerColors: Record<Player['color'], string> = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-400',
};

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | null;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps): JSX.Element {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <h2 className="text-lg font-semibold text-white">Players</h2>
      <ul className="mt-4 space-y-3">
        {players.map((player) => (
          <li key={player.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${playerColors[player.color]}`} />
              <div>
                <p className="font-medium text-white">{player.username}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{player.color}</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>{player.isReady ? 'Ready' : 'Waiting'}</p>
              {currentPlayerId === player.id ? <p className="font-semibold text-royal-gold">Current turn</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
