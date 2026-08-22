import rateLimit from 'express-rate-limit';

export function createRateLimitMiddleware(limit = 120, windowMs = 60_000) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests' },
  });
}
