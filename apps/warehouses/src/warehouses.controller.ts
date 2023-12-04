import { Controller, Get } from '@nestjs/common';

@Controller()
export class WarehousesController {
  @Get('healthcheck')
  healthcheck(): string {
    return 'running...';
  }
}
