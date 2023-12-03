import { Test, TestingModule } from '@nestjs/testing';
import { CalculationsControllerV1 } from './calculations-v1.controller';
import { CalculationsService } from './calculations.service';

describe('CalculationsController', () => {
  let calculationsController: CalculationsControllerV1;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalculationsControllerV1],
      providers: [CalculationsService],
    }).compile();

    calculationsController = app.get<CalculationsControllerV1>(
      CalculationsControllerV1,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(calculationsController.getHello()).toBe('Hello World!');
    });
  });
});
