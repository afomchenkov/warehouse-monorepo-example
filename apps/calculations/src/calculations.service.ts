import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CalculationsRepository } from './calculations.repository';

@Injectable()
export class CalculationsService {
  private readonly logger = new Logger(CalculationsService.name);

  constructor(
    private readonly calculationsRepository: CalculationsRepository,
  ) {}

  /**
   * - the job must be executed daily in order to align the remaining inventory for a certain warehouse
   * - we could assume there are all the time the inventory records for the current day and selected warehouse
   * so that it could be possible to calculate or plan current/future imports/exports
   * - the inventory record assumed per one product with size/quantity, a warehouse can have multiple inventory records
   * - if the calculation job is too expensive, it can be run in a separate thread
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'recalculateInventory',
    timeZone: 'Europe/Berlin',
  })
  async handleScheduledInventoryCalculation(): Promise<void> {
    this.logger.debug('Inventory calculation started');

    // const warehouses = await this.calculationsRepository.getWarehouses();

    this.logger.debug('Inventory calculation ended');
    return Promise.resolve();
  }
}
