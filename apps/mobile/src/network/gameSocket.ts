import type { GameMessage } from '@royal-ludo/shared';

export type ServerMessage =
  | { type: 'ROOM_CREATED'; roomCode: string; color: string }
  | { type: 'PLAYER_JOINED'; playerId: string; color: string }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'GAME_STARTED'; gameState: unknown }
  | { type: 'DICE_ROLLED'; dice: number; gameState: unknown }
  | { type: 'MOVE_APPLIED'; pieceId: string; gameState: unknown }
  | { type: 'GAME_OVER'; winner: string | null }
  | { type: 'ERROR'; error: string };

export class GameSocket {
  private socket: WebSocket | null = null;

  connect(
    url: string,
    onMessage: (message: ServerMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void,
  ) {
    this.socket = new WebSocket(url);

    this.socket.onmessage = event => {
      try {
        onMessage(JSON.parse(event.data) as ServerMessage);
      } catch {
        console.warn('Invalid WebSocket message');
      }
    };

    this.socket.onerror = event => onError?.(event);
    this.socket.onclose = () => onClose?.();
  }

  send(message: GameMessage) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send(JSON.stringify(message));
  }

  close() {
    this.socket?.close();
    this.socket = null;
  }
}
