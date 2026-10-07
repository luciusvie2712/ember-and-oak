import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';

describe('admin password hashing', () => {
  it('round-trips only the correct password with a unique salt', async () => {
    const first = await hashPassword('a-strong-test-password');
    const second = await hashPassword('a-strong-test-password');
    expect(first.hash).not.toBe('a-strong-test-password');
    expect(first.salt).not.toBe(second.salt);
    await expect(
      verifyPassword('a-strong-test-password', first.hash, first.salt),
    ).resolves.toBe(true);
    await expect(
      verifyPassword('incorrect-password', first.hash, first.salt),
    ).resolves.toBe(false);
  });
});
