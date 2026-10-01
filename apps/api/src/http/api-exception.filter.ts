import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

import type { RequestWithId } from './request-context.js';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const code =
      status === HttpStatus.BAD_REQUEST
        ? 'VALIDATION_ERROR'
        : status >= 500
          ? 'INTERNAL_ERROR'
          : 'REQUEST_ERROR';
    const message =
      status === HttpStatus.BAD_REQUEST
        ? 'Request validation failed'
        : status >= 500
          ? 'An unexpected error occurred'
          : 'Request failed';

    response.status(status).json({
      error: { code, message, requestId: request.requestId ?? 'unknown' },
    });
  }
}
