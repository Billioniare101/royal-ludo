import 'dotenv/config';
import { createServer } from './server.js';

const PORT = Number.parseInt(process.env.PORT ?? '3001', 10);

const { server } = createServer();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket server ready');
});
