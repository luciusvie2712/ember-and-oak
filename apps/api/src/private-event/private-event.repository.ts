import { Injectable } from '@nestjs/common';
import type {
  CreatePrivateEventEnquiryInput,
  PrivateEventEnquiryReceipt,
} from '@ember-and-oak/types';

import type { DatabaseClient } from '../database/content-database.service.js';

type ReceiptRow = { id: string; received_at: Date };

@Injectable()
export class PrivateEventRepository {
  async create(
    input: CreatePrivateEventEnquiryInput,
    client: DatabaseClient,
  ): Promise<PrivateEventEnquiryReceipt> {
    const result = await client.query<ReceiptRow>(
      `INSERT INTO private_event_enquiries
         (name, email, phone, event_date, guests, event_type, budget, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, created_at AS received_at`,
      [
        input.name,
        input.email,
        input.phone,
        input.eventDate,
        input.guests,
        input.eventType,
        input.budget ?? null,
        input.message ?? null,
      ],
    );
    const row = result.rows[0];
    if (!row) throw new Error('Enquiry insert returned no receipt');
    return { id: row.id, receivedAt: row.received_at.toISOString() };
  }

  async findReceiptById(
    id: string,
    client: DatabaseClient,
  ): Promise<PrivateEventEnquiryReceipt | null> {
    const result = await client.query<ReceiptRow>(
      `SELECT id, created_at AS received_at
       FROM private_event_enquiries WHERE id = $1`,
      [id],
    );
    const row = result.rows[0];
    return row
      ? { id: row.id, receivedAt: row.received_at.toISOString() }
      : null;
  }
}
