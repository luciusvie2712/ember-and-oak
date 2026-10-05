import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import type { CreateReservationInput } from '@ember-and-oak/types';
import {
  availabilityHttpQuerySchema,
  createReservationSchema,
  idempotencyKeySchema,
} from '@ember-and-oak/validation';

import { ZodValidationPipe } from '../http/zod-validation.pipe.js';
import { AvailabilityService } from './availability.service.js';
import { ReservationDomainError } from './reservation.errors.js';
import { ReservationService } from './reservation.service.js';

@Controller('v1/reservations')
export class ReservationController {
  constructor(
    private readonly availability: AvailabilityService,
    private readonly reservations: ReservationService,
  ) {}

  @Get('availability')
  async getAvailability(
    @Query(new ZodValidationPipe(availabilityHttpQuerySchema))
    query: {
      date: string;
      guests: number;
    },
  ) {
    return {
      data: await this.availability.getAvailability({
        date: query.date,
        guestCount: query.guests,
      }),
    };
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createReservationSchema))
    body: CreateReservationInput,
    @Headers('idempotency-key') rawIdempotencyKey?: string,
  ) {
    const parsedKey = idempotencyKeySchema.safeParse(rawIdempotencyKey);
    if (!parsedKey.success) {
      throw new ReservationDomainError(
        'VALIDATION_ERROR',
        'A valid Idempotency-Key header is required',
      );
    }
    return { data: await this.reservations.create(body, parsedKey.data) };
  }
}
