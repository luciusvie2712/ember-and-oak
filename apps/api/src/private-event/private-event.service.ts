import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import type {
  CreatePrivateEventEnquiryInput,
  PrivateEventEnquiryReceipt,
} from '@ember-and-oak/types';

import { ContentDatabaseService } from '../database/content-database.service.js';
import { PrivateEventDomainError } from './private-event.errors.js';
import { PrivateEventRepository } from './private-event.repository.js';

const retentionHours = 24;

export function normalizePrivateEventInput(
  input: CreatePrivateEventEnquiryInput,
): CreatePrivateEventEnquiryInput {
  const budget = input.budget?.trim();
  const message = input.message?.trim();
  return {
    name: input.name.trim().replace(/\s+/g, ' '),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    eventDate: input.eventDate,
    guests: input.guests,
    eventType: input.eventType.trim().replace(/\s+/g, ' '),
    ...(budget ? { budget } : {}),
    ...(message ? { message } : {}),
  };
}

@Injectable()
export class PrivateEventService {
  constructor(
    private readonly database: ContentDatabaseService,
    private readonly enquiries: PrivateEventRepository,
  ) {}

  async create(
    rawInput: CreatePrivateEventEnquiryInput,
    idempotencyKey: string,
  ): Promise<PrivateEventEnquiryReceipt> {
    const input = normalizePrivateEventInput(rawInput);
    const requestHash = createHash('sha256')
      .update(JSON.stringify(input))
      .digest('hex');

    return this.database.transaction(async (client) => {
      await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
        `private-event-idempotency:${idempotencyKey}`,
      ]);
      await client.query(
        `DELETE FROM private_event_enquiry_idempotency
         WHERE idempotency_key = $1 AND expires_at <= now()`,
        [idempotencyKey],
      );
      const existing = await client.query<{
        request_hash: string;
        enquiry_id: string | null;
      }>(
        `SELECT request_hash, enquiry_id
         FROM private_event_enquiry_idempotency WHERE idempotency_key = $1`,
        [idempotencyKey],
      );
      const record = existing.rows[0];
      if (record) {
        if (record.request_hash !== requestHash || !record.enquiry_id) {
          throw new PrivateEventDomainError(
            'IDEMPOTENCY_CONFLICT',
            'Idempotency key was used for a different or incomplete request',
          );
        }
        const receipt = await this.enquiries.findReceiptById(
          record.enquiry_id,
          client,
        );
        if (!receipt)
          throw new PrivateEventDomainError(
            'INTERNAL_ERROR',
            'Enquiry is unavailable',
          );
        return receipt;
      }

      await client.query(
        `INSERT INTO private_event_enquiry_idempotency
           (idempotency_key, request_hash, expires_at)
         VALUES ($1, $2, now() + ($3 * interval '1 hour'))`,
        [idempotencyKey, requestHash, retentionHours],
      );
      const receipt = await this.enquiries.create(input, client);
      await client.query(
        `UPDATE private_event_enquiry_idempotency SET enquiry_id = $2
         WHERE idempotency_key = $1`,
        [idempotencyKey, receipt.id],
      );
      return receipt;
    });
  }
}
