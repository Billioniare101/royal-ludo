import express, { Application } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { roomRouter } from './routes/rooms';
import { matchRouter } from './routes/matches';
import { healthRouter } from './routes/health';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/matches', matchRouter);

app.use(errorHandler);

export default app;
