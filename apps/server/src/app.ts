import express, { Application } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth';
import { roomRouter } from './routes/rooms';
import { matchRouter } from './routes/matches';
import { healthRouter } from './routes/health';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// CORS: restrict to known origin, not wildcard in production
const allowedOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// Auth routes get stricter rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later.' },
});

app.use('/health', healthRouter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/matches', matchRouter);

app.use(errorHandler);

export default app;
