import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

import type { RequestWithId } from './request-context.js';
import { PrivateEventDomainError } from '../private-event/private-event.errors.js';
import { ReservationDomainError } from '../reservation/reservation.errors.js';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();
    const domainStatus: Partial<
      Record<ReservationDomainError['code'], number>
    > = {
      VALIDATION_ERROR: HttpStatus.BAD_REQUEST,
      CLOSED: HttpStatus.CONFLICT,
      SPECIAL_CLOSURE: HttpStatus.CONFLICT,
      OUTSIDE_BOOKING_WINDOW: HttpStatus.BAD_REQUEST,
      SAME_DAY_CUTOFF: HttpStatus.BAD_REQUEST,
      PARTY_TOO_LARGE: HttpStatus.BAD_REQUEST,
      NO_AVAILABILITY: HttpStatus.CONFLICT,
      SLOT_CONFLICT: HttpStatus.CONFLICT,
      IDEMPOTENCY_CONFLICT: HttpStatus.CONFLICT,
      INVALID_STATE_TRANSITION: HttpStatus.CONFLICT,
      NOT_FOUND: HttpStatus.NOT_FOUND,
      UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
      INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    const status =
      exception instanceof ReservationDomainError ||
      exception instanceof PrivateEventDomainError
        ? (domainStatus[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR)
        : exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
    const code =
      exception instanceof ReservationDomainError ||
      exception instanceof PrivateEventDomainError
        ? exception.code
        : status === HttpStatus.BAD_REQUEST
          ? 'VALIDATION_ERROR'
          : status >= 500
            ? 'INTERNAL_ERROR'
            : 'REQUEST_ERROR';
    const message =
      exception instanceof ReservationDomainError ||
      exception instanceof PrivateEventDomainError
        ? exception.message
        : status === HttpStatus.BAD_REQUEST
          ? 'Request validation failed'
          : status >= 500
            ? 'An unexpected error occurred'
            : 'Request failed';

    response.status(status).json({
      error: { code, message, requestId: request.requestId ?? 'unknown' },
    });
  }
}
