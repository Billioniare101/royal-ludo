import { useEffect } from 'react';
import { useWebSocketStore } from '../store/websocketStore.js';

export function useWebSocket(roomCode: string, token: string | null): void {
  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);

  useEffect(() => {
    if (!roomCode || !token) {
      return;
    }

    connect(roomCode, token);
    return () => {
      disconnect();
    };
  }, [connect, disconnect, roomCode, token]);
}
