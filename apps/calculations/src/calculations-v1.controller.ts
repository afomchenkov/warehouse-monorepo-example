import { Controller, Get, Post, Logger } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import {
  CalculationStatus,
  CalculationResponseDto,
  TransactionDto,
} from './dtos';

@Controller({
  path: 'api',
  version: '1',
})
export class CalculationsControllerV1 {
  private readonly logger = new Logger(CalculationsService.name);

  constructor(private readonly calculationsService: CalculationsService) {}

  @Get('healthcheck')
  healthcheck(): string {
    return 'calculations running...';
  }

  @Post('calculate-inventory')
  async calculateInventory(
    transactionData: TransactionDto,
  ): Promise<CalculationResponseDto> {
    this.logger.debug(
      `Incoming transaction: ${JSON.stringify(transactionData)}`,
    );

    return {
      status: CalculationStatus.REJECTED,
      calculationMessage: 'work in progress...',
    };
  }
}
