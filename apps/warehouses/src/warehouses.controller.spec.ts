import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';

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
    it('should return "Hello World!"', () => {
      expect(warehousesController.getHello()).toBe('Hello World!');
    });
  });
});
