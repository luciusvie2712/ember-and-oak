import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  adminReservationListQuerySchema,
  adminReservationNoteSchema,
  adminReservationTransitionSchema,
} from '@ember-and-oak/validation';

import { AdminRoles } from '../admin-auth/admin-roles.decorator.js';
import { AdminRolesGuard } from '../admin-auth/admin-roles.guard.js';
import {
  AdminSessionGuard,
  type AdminRequest,
} from '../admin-auth/admin-session.guard.js';
import { ZodValidationPipe } from '../http/zod-validation.pipe.js';
import { AdminReservationService } from './admin-reservation.service.js';

@Controller('v1/admin/reservations')
@UseGuards(AdminSessionGuard, AdminRolesGuard)
@AdminRoles('ADMIN', 'HOST')
export class AdminReservationController {
  constructor(private readonly reservations: AdminReservationService) {}
  @Get()
  async list(
    @Query(new ZodValidationPipe(adminReservationListQuerySchema)) query: any,
  ) {
    return { data: await this.reservations.list(query) };
  }
  @Get(':id')
  async detail(@Param('id') id: string) {
    return { data: await this.reservations.detail(id) };
  }
  @Post(':id/status')
  async transition(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(adminReservationTransitionSchema)) body: any,
    @Req() request: AdminRequest,
  ) {
    return {
      data: await this.reservations.transition(id, body, request.adminUser!),
    };
  }
  @Patch(':id/internal-note')
  async note(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(adminReservationNoteSchema))
    body: { internalNote: string | null },
  ) {
    return { data: await this.reservations.updateNote(id, body.internalNote) };
  }
}
