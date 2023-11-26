import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';

@Module({
  imports: [],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
