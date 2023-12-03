import { Controller, Get } from '@nestjs/common';

@Controller('warehouses')
export class WarehousesController {
  @Get('healthcheck')
  healthcheck(): string {
    return 'running...';
  }
}
