import { Controller, Get } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';

@Controller()
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  getHello(): string {
    return this.warehousesService.getHello();
  }

  @Get('calculation')
  async getCalculation(): Promise<string> {
    return this.warehousesService.callCalculation();
  }
}
