import { create } from 'zustand';
import { GameState } from '@royal-ludo/game-engine';

interface GameStore {
  gameState: GameState | null;
  myColor: string | null;
  roomCode: string | null;
  ws: WebSocket | null;
  setGameState: (gs: GameState) => void;
  setMyColor: (c: string) => void;
  setRoomCode: (code: string) => void;
  connect: (roomCode: string, playerId: string) => void;
  disconnect: () => void;
  rollDice: (matchId: string, playerId: string) => void;
  movePiece: (matchId: string, playerId: string, pieceId: string) => void;
}

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000';

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  myColor: null,
  roomCode: null,
  ws: null,

  setGameState: (gs) => set({ gameState: gs }),
  setMyColor: (c) => set({ myColor: c }),
  setRoomCode: (code) => set({ roomCode: code }),

  connect: (roomCode, playerId) => {
    const ws = new WebSocket(`${WS_URL}?playerId=${playerId}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'JOIN_ROOM', roomCode, playerId }));
    };

    ws.onmessage = (event) => {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(event.data as string);
      } catch {
        console.warn('[ws] Received non-JSON message:', event.data);
        return;
      }
      if (data.type === 'ROOM_CREATED' || data.type === 'PLAYER_JOINED') {
        if (data.color) set({ myColor: data.color as string });
      }
      if (data.gameState) {
        set({ gameState: data.gameState as GameState });
      }
    };

    ws.onclose = () => set({ ws: null });
    set({ ws, roomCode });
  },

  disconnect: () => {
    get().ws?.close();
    set({ ws: null, gameState: null, roomCode: null, myColor: null });
  },

  rollDice: (matchId, playerId) => {
    get().ws?.send(JSON.stringify({ type: 'ROLL_DICE', matchId, playerId }));
  },

  movePiece: (matchId, playerId, pieceId) => {
    get().ws?.send(JSON.stringify({ type: 'MOVE_PIECE', matchId, playerId, pieceId }));
  },
}));
