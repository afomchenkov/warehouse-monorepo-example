import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  Inventory,
  Transaction,
  Warehouse,
  getDateWithoutTime,
  generateDateArray,
  getMonthDateRangeFromToday,
} from '@app/common';
import { TransactionDto } from './dtos';

@Injectable()
export class CalculationsRepository {
  constructor(private dataSource: DataSource) {}

  async getWarehouses(): Promise<Warehouse[]> {
    return this.dataSource.getRepository(Warehouse).find();
  }

  async getInventories(): Promise<Inventory[]> {
    return this.dataSource.getRepository(Inventory).find();
  }

  async getWarehouseData(warehouseId: number): Promise<Warehouse> {
    return this.dataSource.getRepository(Warehouse).findOne({
      where: {
        id: warehouseId,
      },
      relations: {
        inventories: true,
      },
      // relations: ['inventories']
    });
  }

  async getInventoriesByWarehouseId(id: number): Promise<Inventory[]> {
    return this.dataSource.getRepository(Inventory).find({
      where: {
        warehouse: {
          id,
        },
      },
    });
  }

  async getInventoriesForDate(targetDate: Date): Promise<Warehouse[]> {
    return this.dataSource
      .getRepository(Warehouse)
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect(
        'warehouse.inventories',
        'inventory',
        // 'DATE(inventory.effective_date) = :targetDate',
        `DATE_TRUNC('day', inventory.effective_date) = :targetDate`,
        {
          targetDate,
        },
      )
      .getMany();
  }

  async getInventoriesForDateRange(
    warehouseId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Warehouse> {
    return this.dataSource
      .getRepository(Warehouse)
      .createQueryBuilder('warehouse')
      .where({
        id: warehouseId,
      })
      .leftJoinAndSelect(
        'warehouse.inventories',
        'inventory',
        // 'inventory.effective_date BETWEEN :startDate AND :endDate',
        `DATE_TRUNC('day', inventory.effective_date) BETWEEN :startDate AND :endDate`,
        {
          startDate,
          endDate,
        },
      )
      .getOne();
  }

  async getLastFrameDayInventories(targetDate: Date): Promise<any> {
    return this.dataSource
      .getRepository(Warehouse)
      .createQueryBuilder('warehouse')
      .loadRelationIdAndMap(
        'warehouse.lastFrameDayInventories',
        'warehouse.inventories',
        'inventory',
        (qb) =>
          qb.where('DATE(inventory.effective_date) = :date', {
            date: targetDate,
          }),
      )
      .getMany();
  }

  /**
   * Updates the selected inventories for data export and creates a new Transaction record
   * NB: does not shift a plan frame one day ahead, export operation does not need to
   *      populate date slots within plan window
   *
   * @param warehouse
   * @param transactionData
   */
  async updateInventoriesForWarehouseExport(
    warehouse: Warehouse,
    transactionData: TransactionDto,
  ): Promise<Transaction> {
    const { productId, size, quantity } = transactionData;

    warehouse.inventories.forEach((inventory) => {
      if (inventory.product.id === productId) {
        inventory.size -= size;
        inventory.quantity -= quantity;
      }
    });

    // Save the changes as a transaction for consistency:
    // 1. save the inventories
    // 2. create transaction record to track history
    return await this.dataSource
      .getRepository(Warehouse)
      .manager.transaction(async (transactionalEntityManager) => {
        const transaction = transactionalEntityManager.create(Transaction, {
          ...transactionData,
        });

        await transactionalEntityManager.save(Warehouse, warehouse);
        await transactionalEntityManager.save(Transaction, transaction);

        return transaction;
      });
  }

  /**
   * Updates the selected inventories for data import and creates a new Transaction record
   *
   * 1. check if the effectiveDay has the corresponding product inventory record
   *    if true, update the record amount till the end of the plan window
   *    if false, create a new inventory record for the product and create inventory records till the end of the plan window
   *
   * 2. create Transaction record
   *
   * @param warehouse
   * @param transactionData
   */
  async updateInventoriesForWarehouseImport(
    warehouse: Warehouse,
    transactionData: TransactionDto,
  ): Promise<Transaction> {
    const { productId, size, quantity, transactionDate, warehouseId } =
      transactionData;

    const effectiveDateInventories = warehouse.inventories.filter(
      (inventory) =>
        getDateWithoutTime(inventory.effectiveDate) ===
        getDateWithoutTime(transactionDate),
    );

    const productInventoryRecord = effectiveDateInventories.find(
      (inventory) => inventory.product.id == productId,
    );

    if (productInventoryRecord) {
      // update existing product inventories from effectiveDate till the end of the plan window
      warehouse.inventories.forEach((inventory) => {
        if (inventory.product.id === productId) {
          inventory.size += size;
          inventory.quantity += quantity;
        }
      });
    }

    return await this.dataSource
      .getRepository(Warehouse)
      .manager.transaction(async (transactionalEntityManager) => {
        const transaction = transactionalEntityManager.create(Transaction, {
          ...transactionData,
        });

        if (!productInventoryRecord) {
          const dateFrom = new Date(transactionDate);
          const { dateTo } = getMonthDateRangeFromToday();
          const inventoryDateRange = generateDateArray(dateFrom, dateTo);

          for (const date of inventoryDateRange) {
            const newInventory = transactionalEntityManager.create(Inventory, {
              quantity,
              size,
              effectiveDate: date,
              product: {
                id: productId,
              },
              warehouse: {
                id: warehouseId,
              },
            });
            warehouse.inventories.push(newInventory);
          }
        }

        await transactionalEntityManager.save(Warehouse, warehouse);
        await transactionalEntityManager.save(Transaction, transaction);

        return transaction;
      });
  }
}
