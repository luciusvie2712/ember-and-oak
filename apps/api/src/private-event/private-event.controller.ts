import { Body, Controller, Headers, Post } from '@nestjs/common';
import type { CreatePrivateEventEnquiryInput } from '@ember-and-oak/types';
import {
  idempotencyKeySchema,
  privateEventEnquirySchema,
} from '@ember-and-oak/validation';

import { ZodValidationPipe } from '../http/zod-validation.pipe.js';
import { PrivateEventDomainError } from './private-event.errors.js';
import { PrivateEventService } from './private-event.service.js';

@Controller('v1/private-event-enquiries')
export class PrivateEventController {
  constructor(private readonly enquiries: PrivateEventService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(privateEventEnquirySchema))
    body: CreatePrivateEventEnquiryInput,
    @Headers('idempotency-key') rawIdempotencyKey?: string,
  ) {
    const key = idempotencyKeySchema.safeParse(rawIdempotencyKey);
    if (!key.success)
      throw new PrivateEventDomainError(
        'VALIDATION_ERROR',
        'A valid Idempotency-Key header is required',
      );
    return { data: await this.enquiries.create(body, key.data) };
  }
}
