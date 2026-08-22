import http from 'node:http';
import cors from 'cors';
import express, { type Express } from 'express';
import { WebSocketServer, type WebSocketServer as WebSocketServerInstance } from 'ws';
import { authRouter } from './routes/auth.js';
import { roomsRouter } from './routes/rooms.js';
import { attachWebSocketHandler } from './websocket/handler.js';

function getAllowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createServer(): { app: Express; wss: WebSocketServerInstance; server: http.Server } {
  const app = express();
  app.use(cors({ origin: getAllowedOrigins() }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/rooms', roomsRouter);

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  attachWebSocketHandler(wss);

  return { app, wss, server };
}
