import { randomBytes } from 'node:crypto';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateReservationCode(): string {
  const bytes = randomBytes(6);
  let suffix = '';
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length];
  return `EO-${suffix}`;
}
