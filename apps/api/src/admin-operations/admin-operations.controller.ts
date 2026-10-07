import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  reservationTimeSchema,
  specialClosureSchema,
  z,
} from '@ember-and-oak/validation';

import { AdminRoles } from '../admin-auth/admin-roles.decorator.js';
import { AdminRolesGuard } from '../admin-auth/admin-roles.guard.js';
import { AdminSessionGuard } from '../admin-auth/admin-session.guard.js';
import { ZodValidationPipe } from '../http/zod-validation.pipe.js';
import { AdminOperationsService } from './admin-operations.service.js';

const hoursUpdateSchema = z
  .object({
    isClosed: z.boolean(),
    openTime: reservationTimeSchema.optional(),
    closeTime: reservationTimeSchema.optional(),
  })
  .superRefine((value, context) => {
    if (!value.isClosed && (!value.openTime || !value.closeTime)) {
      context.addIssue({
        code: 'custom',
        message: 'Open days require open and close times',
      });
    }
    if (
      value.openTime &&
      value.closeTime &&
      value.openTime >= value.closeTime
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Opening time must precede closing time',
      });
    }
  });
const closureAdminSchema = specialClosureSchema.safeExtend({
  isActive: z.boolean().optional(),
});

@Controller('v1/admin/operations')
@UseGuards(AdminSessionGuard, AdminRolesGuard)
@AdminRoles('ADMIN')
export class AdminOperationsController {
  constructor(private readonly operations: AdminOperationsService) {}
  @Get('opening-hours') hours() {
    return this.operations.openingHours().then((data) => ({ data }));
  }
  @Patch('opening-hours/:dayOfWeek') async updateHours(
    @Param('dayOfWeek') day: string,
    @Body(new ZodValidationPipe(hoursUpdateSchema)) body: any,
  ) {
    const dayOfWeek = z.coerce.number().int().min(0).max(6).parse(day);
    return { data: await this.operations.updateOpeningHours(dayOfWeek, body) };
  }
  @Get('special-closures') async closures() {
    return { data: await this.operations.closures() };
  }
  @Post('special-closures') async create(
    @Body(new ZodValidationPipe(closureAdminSchema)) body: any,
  ) {
    return { data: await this.operations.createClosure(body) };
  }
  @Patch('special-closures/:id') async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(closureAdminSchema)) body: any,
  ) {
    return { data: await this.operations.updateClosure(id, body) };
  }
  @Delete('special-closures/:id') async deactivate(@Param('id') id: string) {
    return { data: await this.operations.deactivateClosure(id) };
  }
}
