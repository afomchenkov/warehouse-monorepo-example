import { Injectable, Logger } from '@nestjs/common';
import { CalculationStatus } from '@app/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CalculationsRepository } from './calculations.repository';
import { getMonthDateRangeFromToday, TransactionType } from '@app/common';
import { CalculationResponseDto, TransactionDto } from './dtos';
import {
  throwIfEmptyInventoriesExport,
  throwIfNotEnoughInventoryForProductExport,
  throwIfNotEnoughCapacityForProductImport,
} from './utils';

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
   *
   * For every warehouse we should take the last frame day inventories and shift them one day ahead
   * if the next day is still empty, this way we shift the planned stock frame one day ahead
   * (NB: the oncoming day can be filled if the future import has been created for it)
   *
   * --------------------------- 1. Today ---------------------------
   *
   *   |------ stock window 1 month ------|
   * 10 Nov . . . . . . . . . . . . . . 11 Dec
   *
   * -------------------------- 2. Tomorrow -------------------------
   *
   *                |------ stock window 1 month ------|
   * 10 Nov . . 11 Nov . . . . . . . . . . . . . . . 12 Dec
   *
   * ------------------ 3. The day after tomorrow -------------------
   *
   *                          |------ stock window 1 month ------|
   * 10 Nov . . 11 Nov . . 12 Nov . . . . . . . . . . . . . .. 13 Dec
   *
   * ----------------------------------------------------------------
   *
   * This way we'll have the inventory state for the plan window all the time.
   * The past dates inventories can be removed after predefined period of time,
   * (if there is no requirement to have the inventories history).
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'recalculateInventory',
    timeZone: 'Europe/Berlin',
  })
  async handleScheduledInventoryCalculation(): Promise<void> {
    this.logger.debug('Inventory calculation started');

    // const warehouses = await this.calculationsRepository.getWarehouses();
    // for (const warehouse of warehouses) {
    //   warehouse.inventories
    // }

    this.logger.debug('Inventory calculation ended');
    return Promise.resolve();
  }

  /**
   * On transaction submit (IMPORT):
   *
   *  1. Check the effectiveDate against the existing plan window (1 month)
   *    - for every existing cumulative inventory per day check against the maxAmount and amount to be added
   *    - if the amount can be saved, add the amount, otherwise reject the operation
   *  2. Save the transaction record
   */
  async handleTransactionSubmit(
    transactionData: TransactionDto,
  ): Promise<CalculationResponseDto> {
    const {
      transactionType,
      quantity,
      size,
      transactionDate,
      warehouseId,
      productId,
    } = transactionData;
    const dateFrom = new Date(transactionDate);
    const { dateTo } = getMonthDateRangeFromToday();
    const transactionSize = quantity * size; // itemsQuantity * sizeOfOneItem = totalAmount

    const warehouse =
      await this.calculationsRepository.getInventoriesForDateRange(
        warehouseId,
        dateFrom,
        dateTo,
      );

    const { maxCapacity, inventories } = warehouse;
    this.logger.debug(
      `Max capacity: [${maxCapacity}] - Inventories: ${JSON.stringify(
        inventories,
      )}`,
    );

    // throws if no inventories to do an export
    throwIfEmptyInventoriesExport(inventories, transactionType);
    // right now we assume the export can be done for today only
    throwIfNotEnoughInventoryForProductExport(
      inventories,
      transactionType,
      productId,
      transactionSize,
    );
    // we cannot do an import if the stock date frame for the given product [today, ...., importDate, ...., endOfFrameDate]
    // will have greater amount than the warehouse maxCapacity
    throwIfNotEnoughCapacityForProductImport(
      inventories,
      transactionType,
      transactionSize,
      transactionDate,
      maxCapacity,
    );

    // at this point we can do an import/export
    if (transactionType === TransactionType.EXPORT) {
      const transaction =
        await this.calculationsRepository.updateInventoriesForWarehouseExport(
          warehouse,
          transactionData,
        );

      return {
        status: CalculationStatus.ACCEPTED,
        calculationMessage: 'The request amount has successfully been exported',
        transactionId: transaction.id,
      };
    }

    if (transactionType === TransactionType.IMPORT) {
      const transaction =
        await this.calculationsRepository.updateInventoriesForWarehouseImport(
          warehouse,
          transactionData,
        );

      return {
        status: CalculationStatus.ACCEPTED,
        calculationMessage: 'The request amount has successfully been imported',
        transactionId: transaction.id,
      };
    }
  }
}
