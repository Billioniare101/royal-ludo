import type { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requestLog = new Map<string, RateLimitEntry>();

export function createRateLimitMiddleware(limit = 120, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip ?? 'unknown'}:${req.baseUrl}:${req.path}`;
    const now = Date.now();
    const current = requestLog.get(key);

    if (!current || current.resetAt <= now) {
      requestLog.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= limit) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    current.count += 1;
    requestLog.set(key, current);
    next();
  };
}
