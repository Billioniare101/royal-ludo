import type { ClientMessage, ServerMessage } from '@royal-ludo/shared';
import { create } from 'zustand';
import { useGameStore } from './gameStore.js';

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

interface WebSocketState {
  socket: WebSocket | null;
  status: ConnectionStatus;
  lastMessageType: ServerMessage['type'] | null;
  connect: (roomCode: string, token: string) => void;
  disconnect: () => void;
  send: (message: ClientMessage) => void;
}

function getWebSocketUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
}

function handleServerMessage(message: ServerMessage): void {
  const gameStore = useGameStore.getState();

  switch (message.type) {
    case 'room_joined':
    case 'game_state_update':
    case 'game_started':
      gameStore.setGame(message.game);
      break;
    case 'room_left':
      gameStore.setGame(null);
      break;
    case 'error':
      gameStore.setError(message.message);
      break;
    case 'player_left':
    case 'player_joined':
    case 'dice_rolled':
    case 'piece_moved':
    case 'game_over':
    case 'connected':
    case 'pong':
      if (message.type === 'game_over') {
        gameStore.setError(`Game over! Winner: ${message.winner}`);
      }
      break;
  }
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  status: 'idle',
  lastMessageType: null,
  connect: (roomCode, token) => {
    const currentSocket = get().socket;
    if (currentSocket && (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    set({ status: 'connecting' });
    const socket = new WebSocket(getWebSocketUrl());

    socket.addEventListener('open', () => {
      set({ status: 'connected', socket });
      socket.send(JSON.stringify({ type: 'join_room', roomCode, token } satisfies ClientMessage));
    });

    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data as string) as ServerMessage;
        set({ lastMessageType: message.type });
        handleServerMessage(message);
      } catch {
        useGameStore.getState().setError('Received an invalid realtime payload.');
      }
    });

    socket.addEventListener('close', () => {
      set({ socket: null, status: 'disconnected' });
    });

    socket.addEventListener('error', () => {
      useGameStore.getState().setError('Realtime connection failed.');
    });
  },
  disconnect: () => {
    get().socket?.close();
    set({ socket: null, status: 'disconnected' });
  },
  send: (message) => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      useGameStore.getState().setError('WebSocket is not connected.');
      return;
    }
    socket.send(JSON.stringify(message));
  },
}));
