import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
// import { CommonModule } from '@app/common';

@Module({
  imports: [],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
