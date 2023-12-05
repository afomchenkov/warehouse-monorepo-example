import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'api',
  version: '1',
})
export class WarehousesController {
  @Get('healthcheck')
  healthcheck(): string {
    return 'warehouses running...';
  }
}
