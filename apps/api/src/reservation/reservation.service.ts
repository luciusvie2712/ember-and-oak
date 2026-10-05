import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import type {
  CreateReservationInput,
  CreateReservationResult,
} from '@ember-and-oak/types';

import { ContentDatabaseService } from '../database/content-database.service.js';
import { AvailabilityService } from './availability.service.js';
import { generateReservationCode } from './reservation-code.js';
import { reservationConfig } from './reservation-config.js';
import { ReservationDomainError } from './reservation.errors.js';
import { ReservationRepository } from './reservation.repository.js';

type DatabaseError = Error & { code?: string; constraint?: string };

export function normalizeCreateReservationInput(
  input: CreateReservationInput,
): CreateReservationInput {
  const specialRequest = input.specialRequest?.trim();
  return {
    date: input.date,
    startTime: input.startTime.slice(0, 5),
    guestCount: input.guestCount,
    guest: {
      name: input.guest.name.trim().replace(/\s+/g, ' '),
      email: input.guest.email.trim().toLowerCase(),
      phone: input.guest.phone.trim(),
    },
    ...(specialRequest ? { specialRequest } : {}),
  };
}

export function hashReservationRequest(input: CreateReservationInput): string {
  return createHash('sha256')
    .update(JSON.stringify(normalizeCreateReservationInput(input)))
    .digest('hex');
}

@Injectable()
export class ReservationService {
  constructor(
    private readonly database: ContentDatabaseService,
    private readonly availability: AvailabilityService,
    private readonly reservations: ReservationRepository,
  ) {}

  async create(
    rawInput: CreateReservationInput,
    idempotencyKey: string,
  ): Promise<CreateReservationResult> {
    const input = normalizeCreateReservationInput(rawInput);
    const requestHash = hashReservationRequest(input);

    return this.database.transaction(async (client) => {
      await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
        `reservation-idempotency:${idempotencyKey}`,
      ]);
      await client.query(
        `DELETE FROM reservation_idempotency
         WHERE idempotency_key = $1 AND expires_at <= now()`,
        [idempotencyKey],
      );
      const existing = await client.query<{
        request_hash: string;
        reservation_id: string | null;
      }>(
        `SELECT request_hash, reservation_id
         FROM reservation_idempotency WHERE idempotency_key = $1`,
        [idempotencyKey],
      );
      const record = existing.rows[0];
      if (record) {
        if (record.request_hash !== requestHash) {
          throw new ReservationDomainError(
            'IDEMPOTENCY_CONFLICT',
            'Idempotency key was used for a different request',
          );
        }
        if (!record.reservation_id) {
          throw new ReservationDomainError(
            'IDEMPOTENCY_CONFLICT',
            'Idempotency request is incomplete',
          );
        }
        const reservation = await this.reservations.findSummaryById(
          record.reservation_id,
          client,
        );
        if (!reservation) {
          throw new ReservationDomainError(
            'INTERNAL_ERROR',
            'Reservation is unavailable',
          );
        }
        return { reservation, idempotentReplay: true };
      }

      await client.query(
        `INSERT INTO reservation_idempotency
           (idempotency_key, request_hash, expires_at)
         VALUES ($1, $2, now() + ($3 * interval '1 hour'))`,
        [
          idempotencyKey,
          requestHash,
          reservationConfig.idempotencyRetentionHours,
        ],
      );
      await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
        `reservation-date:${input.date}`,
      ]);

      const availability = await this.availability.getAvailability(
        { date: input.date, guestCount: input.guestCount },
        client,
      );
      const slot = availability.slots.find(
        (candidate) => candidate.startTime === input.startTime,
      );
      if (!slot?.available) {
        throw new ReservationDomainError(
          'SLOT_CONFLICT',
          'Requested slot is no longer available',
        );
      }

      let reservation: CreateReservationResult['reservation'] | undefined;
      for (let attempt = 0; attempt < 3 && !reservation; attempt += 1) {
        await client.query('SAVEPOINT reservation_code_attempt');
        try {
          reservation = await this.reservations.create(
            input,
            generateReservationCode(),
            client,
          );
          await client.query('RELEASE SAVEPOINT reservation_code_attempt');
        } catch (error) {
          await client.query('ROLLBACK TO SAVEPOINT reservation_code_attempt');
          const databaseError = error as DatabaseError;
          if (
            databaseError.code !== '23505' ||
            databaseError.constraint !== 'reservations_reservation_code_key'
          ) {
            throw error;
          }
        }
      }
      if (!reservation) {
        throw new ReservationDomainError(
          'INTERNAL_ERROR',
          'Could not allocate a reservation code',
        );
      }

      await client.query(
        `UPDATE reservation_idempotency SET reservation_id = $2
         WHERE idempotency_key = $1`,
        [idempotencyKey, reservation.id],
      );
      return { reservation, idempotentReplay: false };
    });
  }
}
