import { describe, expect, it } from 'vitest';

import { invalidationTargets, publishedSchemas } from './content-contract.js';
import { phaseSevenSeedDocuments } from './seed-data.js';

describe('Phase 7 content publication', () => {
  it('validates every seed document through its public contract', () => {
    for (const document of phaseSevenSeedDocuments) {
      expect(() =>
        publishedSchemas[document.type].parse(document.content),
      ).not.toThrow();
    }
  });

  it('invalidates Home when canonical Menu content changes', () => {
    expect(invalidationTargets('menu', 'dinner')).toEqual({
      tags: ['menu', 'menu:dinner', 'home'],
      paths: ['/menu', '/'],
    });
  });

  it('invalidates every referencing surface when media changes', () => {
    const targets = invalidationTargets('media', 'media-hero-dish');
    expect(targets.paths).toEqual(['/menu', '/our-story', '/gallery', '/']);
    expect(targets.tags).toContain('media:media-hero-dish');
  });
});
