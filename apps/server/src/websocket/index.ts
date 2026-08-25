import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GameMessageSchema } from '@royal-ludo/shared';
import { GameRoomManager } from './gameRoomManager';

const manager = new GameRoomManager();

export function setupWebSocket(server: HttpServer): void {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url ?? '/', `http://localhost`);
    const playerId = url.searchParams.get('playerId') ?? 'anonymous';
    console.log(`[ws] Client connected: ${playerId}`);

    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        const parse = GameMessageSchema.safeParse(data);
        if (!parse.success) {
          ws.send(JSON.stringify({ type: 'ERROR', error: 'Invalid message' }));
          return;
        }
        manager.handleMessage(ws, playerId, parse.data);
      } catch {
        ws.send(JSON.stringify({ type: 'ERROR', error: 'Parse error' }));
      }
    });

    ws.on('close', () => {
      manager.removePlayer(playerId);
      console.log(`[ws] Client disconnected: ${playerId}`);
    });
  });
}
