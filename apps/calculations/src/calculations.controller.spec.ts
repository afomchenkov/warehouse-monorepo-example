import { Test, TestingModule } from '@nestjs/testing';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';

describe('CalculationsController', () => {
  let calculationsController: CalculationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalculationsController],
      providers: [CalculationsService],
    }).compile();

    calculationsController = app.get<CalculationsController>(CalculationsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(calculationsController.getHello()).toBe('Hello World!');
    });
  });
});
