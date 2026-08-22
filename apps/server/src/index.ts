// src/index.ts - Royal Ludo Server Entry Point
import 'dotenv/config';
import http from 'http';
import app from './app';
import { setupWebSocket } from './websocket/index';

const PORT = process.env.PORT ?? 4000;

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`[server] Royal Ludo server running on port ${PORT}`);
});

export default server;
