import {
  Controller,
  Get,
  Post,
  Logger,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { CalculationStatus } from '@app/common';
import { CalculationsService } from './calculations.service';
import { CalculationResponseDto, TransactionDto } from './dtos';

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

  @Post('submit-transaction')
  async submitTransaction(
    @Body(ValidationPipe) transactionData: TransactionDto,
  ): Promise<CalculationResponseDto> {
    this.logger.debug(
      `Incoming transaction: ${JSON.stringify(transactionData)}`,
    );

    try {
      const { status, calculationMessage, transactionId } =
        await this.calculationsService.handleTransactionSubmit(transactionData);

      this.logger.debug(
        `Handle transaction result: [${status}]:[${calculationMessage}]`,
      );

      return {
        status,
        calculationMessage,
        transactionId,
      };
    } catch (error) {
      this.logger.error(`Handle transaction error: [${error.message}]`);

      return {
        status: CalculationStatus.REJECTED,
        calculationMessage: error.message,
        transactionId: null,
      };
    }
  }
}
