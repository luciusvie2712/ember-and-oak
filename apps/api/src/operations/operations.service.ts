import { Injectable, NotFoundException } from '@nestjs/common';
import type { PublicOperations } from '@ember-and-oak/types';
import { publicOperationsSchema } from '@ember-and-oak/validation';

import { ContentService } from '../content/content.service.js';
import { OpeningHoursRepository } from '../reservation/opening-hours.repository.js';
import { restaurantLocalDate } from '../reservation/reservation-time.js';
import { SpecialClosureRepository } from '../reservation/special-closure.repository.js';

@Injectable()
export class OperationsService {
  constructor(
    private readonly content: ContentService,
    private readonly hours: OpeningHoursRepository,
    private readonly closures: SpecialClosureRepository,
  ) {}

  async getPublic(slug = 'primary'): Promise<PublicOperations> {
    const editorial = await this.content.getOperations(slug);
    if (!editorial)
      throw new NotFoundException('Published operations content was not found');
    const [openingHours, specialClosures] = await Promise.all([
      this.hours.findAll(),
      this.closures.findPublicUpcoming(restaurantLocalDate(new Date())),
    ]);
    return publicOperationsSchema.parse({
      location: editorial.location,
      contact: editorial.contact,
      openingHours,
      specialClosures,
      policies: editorial.policies
        .filter((policy) => policy.publishState === 'PUBLISHED')
        .map(({ type, title, body }) => ({ type, title, body })),
    });
  }
}
