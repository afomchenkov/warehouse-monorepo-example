import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './services/warehouses.service';

describe('WarehousesController', () => {
  let warehousesController: WarehousesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WarehousesController],
      providers: [WarehousesService],
    }).compile();

    warehousesController = app.get<WarehousesController>(WarehousesController);
  });

  describe('root', () => {
    it('should return "running..."', () => {
      expect(warehousesController.healthcheck()).toBe('running...');
    });
  });
});
