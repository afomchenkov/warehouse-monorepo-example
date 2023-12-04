import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CalculationsService {
  private readonly logger = new Logger(CalculationsService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'inventoryCalculate',
    // timeZone: 'Europe/Germany',
  })
  async handleScheduledInventoryCalculate(): Promise<void> {
    this.logger.debug('Inventory calculation started');

    return Promise.resolve();
  }
}
