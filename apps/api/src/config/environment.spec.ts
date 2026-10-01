import { describe, expect, it } from 'vitest';

import { loadEnvironment } from './environment.js';

describe('API environment', () => {
  it('fails fast when DATABASE_URL is missing', () => {
    expect(() => loadEnvironment({ NODE_ENV: 'test' })).toThrow(
      'Invalid environment configuration: DATABASE_URL',
    );
  });

  it('normalizes a valid local configuration', () => {
    const environment = loadEnvironment({
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://ember:password@localhost:5432/ember_and_oak',
    });

    expect(environment.PORT).toBe(4000);
    expect(environment.DATABASE_CHECK_ON_STARTUP).toBe(false);
  });
});
