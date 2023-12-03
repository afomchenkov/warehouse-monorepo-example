import { Controller, Get } from '@nestjs/common';
import { CalculationsService } from './calculations.service';

@Controller({
  path: 'calculations',
  version: '1',
})
export class CalculationsControllerV1 {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Get('healthcheck')
  healthcheck(): string {
    return 'running...';
  }
}
