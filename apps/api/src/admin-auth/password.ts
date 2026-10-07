import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(16).toString('base64url');
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return { hash: derived.toString('base64url'), salt };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const expected = Buffer.from(hash, 'base64url');
  return (
    expected.length === derived.length && timingSafeEqual(expected, derived)
  );
}

const FAKE_SALT = 'YWRtaW4tZmFrZS1zYWx0';
let fakeHash: Promise<string> | undefined;

export async function fakePasswordVerification(
  password: string,
): Promise<void> {
  fakeHash ??= scrypt('not-a-real-admin-password', FAKE_SALT, KEY_LENGTH).then(
    (value) => (value as Buffer).toString('base64url'),
  );
  await verifyPassword(password, await fakeHash, FAKE_SALT);
}
