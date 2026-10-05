import { Injectable } from '@nestjs/common';
import type {
  AvailabilityQuery,
  AvailabilityResult,
} from '@ember-and-oak/types';

import type { DatabaseClient } from '../database/content-database.service.js';
import { CapacityRepository } from './capacity.repository.js';
import { OpeningHoursRepository } from './opening-hours.repository.js';
import { ReservationRepository } from './reservation.repository.js';
import { reservationConfig } from './reservation-config.js';
import { ReservationDomainError } from './reservation.errors.js';
import {
  addCalendarDays,
  addMinutes,
  dayOfWeek,
  generateCandidateSlots,
  intervalsOverlap,
  restaurantLocalDate,
  restaurantLocalDateTimeEpoch,
} from './reservation-time.js';
import { SpecialClosureRepository } from './special-closure.repository.js';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly openingHours: OpeningHoursRepository,
    private readonly closures: SpecialClosureRepository,
    private readonly capacities: CapacityRepository,
    private readonly reservations: ReservationRepository,
  ) {}

  async getAvailability(
    query: AvailabilityQuery,
    client?: DatabaseClient,
    now = new Date(),
  ): Promise<AvailabilityResult> {
    if (query.guestCount < reservationConfig.minimumGuests) {
      throw new ReservationDomainError(
        'VALIDATION_ERROR',
        'Guest count is invalid',
      );
    }
    if (query.guestCount > reservationConfig.maximumGuests) {
      throw new ReservationDomainError('PARTY_TOO_LARGE', 'Party is too large');
    }

    const today = restaurantLocalDate(now);
    if (
      query.date < today ||
      query.date > addCalendarDays(today, reservationConfig.bookingWindowDays)
    ) {
      throw new ReservationDomainError(
        'OUTSIDE_BOOKING_WINDOW',
        'Date is outside the booking window',
      );
    }

    const weekday = dayOfWeek(query.date);
    const hours = await this.openingHours.findForDay(weekday, client);
    if (!hours || hours.isClosed || !hours.openTime || !hours.closeTime) {
      return this.empty(query, 'CLOSED');
    }

    const closures = await this.closures.findForDate(query.date, client);
    if (closures.some((closure) => closure.type === 'FULL_DAY')) {
      return this.empty(query, 'SPECIAL_CLOSURE');
    }

    const capacity = await this.capacities.getCapacityForDay(weekday, client);
    if (!capacity) return this.empty(query, 'NO_AVAILABILITY');

    const existing = await this.reservations.findCapacityConsumingForDate(
      query.date,
      client,
    );
    const candidates = generateCandidateSlots(hours.openTime, hours.closeTime)
      .filter((slot) => {
        if (query.date !== today) return true;
        return (
          restaurantLocalDateTimeEpoch(query.date, slot.startTime) -
            now.getTime() >=
          reservationConfig.sameDayCutoffMinutes * 60_000
        );
      })
      .filter(
        (slot) =>
          !closures.some(
            (closure) =>
              closure.type === 'PARTIAL_DAY' &&
              closure.startTime &&
              closure.endTime &&
              intervalsOverlap(
                slot.startTime,
                slot.endTime,
                closure.startTime,
                closure.endTime,
              ),
          ),
      );

    const slots = candidates.map((slot) => {
      const used = existing
        .filter((reservation) =>
          intervalsOverlap(
            slot.startTime,
            slot.endTime,
            reservation.startTime,
            addMinutes(
              reservation.startTime,
              reservationConfig.durationMinutes,
            ),
          ),
        )
        .reduce((sum, reservation) => sum + reservation.guestCount, 0);
      const remainingCapacity = Math.max(0, capacity - used);
      return {
        ...slot,
        available: query.guestCount <= remainingCapacity,
        remainingCapacity,
      };
    });

    return {
      date: query.date,
      guestCount: query.guestCount,
      timezone: reservationConfig.timezone,
      status: slots.some((slot) => slot.available)
        ? 'AVAILABLE'
        : 'NO_AVAILABILITY',
      slots,
    };
  }

  private empty(
    query: AvailabilityQuery,
    status: AvailabilityResult['status'],
  ): AvailabilityResult {
    return {
      date: query.date,
      guestCount: query.guestCount,
      timezone: reservationConfig.timezone,
      status,
      slots: [],
    };
  }
}
