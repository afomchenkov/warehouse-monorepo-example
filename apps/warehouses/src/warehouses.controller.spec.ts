import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesController } from './warehouses.controller';
import { WarehouseService } from './services/warehouse.service';

describe('WarehousesController', () => {
  let warehousesController: WarehousesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WarehousesController],
      providers: [WarehouseService],
    }).compile();

    warehousesController = app.get<WarehousesController>(WarehousesController);
  });

  describe('root', () => {
    it('should return "warehouses running..."', () => {
      expect(warehousesController.healthcheck()).toBe('warehouses running...');
    });
  });
});
