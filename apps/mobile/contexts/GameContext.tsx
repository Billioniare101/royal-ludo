import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type PlayerColor = 'ruby' | 'sapphire' | 'emerald' | 'gold';

export type Player = {
  color: PlayerColor;
  name: string;
  progress: number;
  score: number;
};

type GameState = {
  players: Player[];
  currentTurn: number;
  lastRoll: number | null;
  status: 'waiting' | 'playing' | 'finished';
  winner: string | null;
};

type GameContextValue = GameState & {
  startMatch: (count: 2 | 4) => void;
  rollDice: () => void;
  resetMatch: () => void;
};

const initialPlayers: Player[] = [
  { color: 'ruby', name: 'Ruby', progress: 0, score: 0 },
  { color: 'sapphire', name: 'Sapphire', progress: 0, score: 0 },
  { color: 'emerald', name: 'Emerald', progress: 0, score: 0 },
  { color: 'gold', name: 'Gold', progress: 0, score: 0 },
];

const initialState: GameState = {
  players: initialPlayers,
  currentTurn: 0,
  lastRoll: null,
  status: 'waiting',
  winner: null,
};

const GameContext = createContext<GameContextValue | null>(null);
const STORAGE_KEY = 'royal-ludo-local-match';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameState>(initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) setGame(JSON.parse(saved) as GameState);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(game)).catch(() => undefined);
  }, [game]);

  const startMatch = (count: 2 | 4) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGame({
      players: initialPlayers.slice(0, count),
      currentTurn: 0,
      lastRoll: null,
      status: 'playing',
      winner: null,
    });
  };

  const resetMatch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGame(initialState);
  };

  const rollDice = () => {
    if (game.status !== 'playing' || game.winner) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    Haptics.notificationAsync(roll === 6 ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Success);
    setGame((previous) => {
      const players = previous.players.map((player, index) =>
        index === previous.currentTurn
          ? { ...player, progress: Math.min(56, player.progress + roll), score: Math.min(56, player.score + roll) }
          : player,
      );
      const activePlayer = players[previous.currentTurn];
      const hasWinner = activePlayer.progress === 56;
      return {
        ...previous,
        players,
        lastRoll: roll,
        winner: hasWinner ? activePlayer.name : null,
        status: hasWinner ? 'finished' : 'playing',
        currentTurn: hasWinner || roll === 6 ? previous.currentTurn : (previous.currentTurn + 1) % players.length,
      };
    });
  };

  const value = useMemo(
    () => ({ ...game, startMatch, rollDice, resetMatch }),
    [game],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
}