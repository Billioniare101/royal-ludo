import type { GameState } from '@royal-ludo/shared';
import { create } from 'zustand';

interface GameStateStore {
  game: GameState | null;
  selectedPieceId: string | null;
  error: string | null;
  setGame: (game: GameState | null) => void;
  setSelectedPiece: (pieceId: string | null) => void;
  setError: (message: string | null) => void;
}

export const useGameStore = create<GameStateStore>((set) => ({
  game: null,
  selectedPieceId: null,
  error: null,
  setGame: (game) => set({ game, error: null }),
  setSelectedPiece: (selectedPieceId) => set({ selectedPieceId }),
  setError: (error) => set({ error }),
}));
