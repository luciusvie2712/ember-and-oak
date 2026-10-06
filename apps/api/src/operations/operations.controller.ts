import { Controller, Get } from '@nestjs/common';

import { OperationsService } from './operations.service.js';

@Controller('v1/operations')
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}

  @Get()
  async getPublic() {
    return { data: await this.operations.getPublic() };
  }
}
