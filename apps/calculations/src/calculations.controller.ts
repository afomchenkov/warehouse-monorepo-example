import { Controller, Get } from '@nestjs/common';
import { CalculationsService } from './calculations.service';

@Controller()
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Get()
  getHello(): string {
    return this.calculationsService.getHello();
  }
}
