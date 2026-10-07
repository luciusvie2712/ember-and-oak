import { describe, expect, it } from 'vitest';
import { createSessionToken, hashSessionToken } from './session-token.js';

describe('opaque admin session token', () => {
  it('creates URL-safe random tokens and stores a non-reversible digest', () => {
    const first = createSessionToken();
    const second = createSessionToken();
    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(first).not.toBe(second);
    expect(hashSessionToken(first)).not.toBe(first);
    expect(hashSessionToken(first)).toBe(hashSessionToken(first));
  });
});
