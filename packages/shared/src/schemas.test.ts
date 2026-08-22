import { describe, expect, it } from 'vitest';
import { CreateRoomSchema, RegisterSchema } from './schemas.js';

describe('shared schemas', () => {
  it('validates register payloads', () => {
    const result = RegisterSchema.safeParse({
      username: 'royal-player',
      email: 'player@example.com',
      password: 'secret123',
    });

    expect(result.success).toBe(true);
  });

  it('applies default room size', () => {
    const result = CreateRoomSchema.parse({});
    expect(result.maxPlayers).toBe(4);
  });
});
