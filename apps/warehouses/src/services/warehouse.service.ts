import { NotFoundException, Injectable, Logger } from '@nestjs/common';
import { Warehouse } from '@app/common';
import { WarehouseRepository } from '../repositories';
import { CustomerService } from './customer.service';
import { CreateWarehouseDto, StockSnapshotDto } from '../dtos';
import { calculateOccupiedArea } from '../utils';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

  constructor(
    private readonly customerService: CustomerService,
    private readonly warehouseRepository: WarehouseRepository,
  ) {}

  async getAllByOwnerId(customerId: number): Promise<Warehouse[]> {
    // validate if the customer exists
    await this.customerService.getCustomerById(customerId);
    return this.warehouseRepository.getAllByOwnerId(customerId);
  }

  async createWarehouse(warehouseData: CreateWarehouseDto): Promise<Warehouse> {
    const { customerId } = warehouseData;
    const customer = await this.customerService.getCustomerById(customerId);
    return this.warehouseRepository.createWarehouse(warehouseData, customer);
  }

  async getWarehouseCurrentStockSnapshot(
    warehouseId: number,
  ): Promise<StockSnapshotDto> {
    const currentDate = new Date();
    const warehouse: Warehouse =
      await this.warehouseRepository.getWarehouseInventories(
        warehouseId,
        currentDate,
      );

    if (!warehouse) {
      const message = `Warehouse for stock snapshot not found: ${warehouseId}`;
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    const occupiedAmount = calculateOccupiedArea(warehouse.inventories);

    return {
      warehouseId,
      totalMaxAmount: warehouse.maxCapacity,
      occupiedAmount,
    };
  }

  async getAllWarehousesCurrentStockSnapshots(): Promise<StockSnapshotDto[]> {
    const currentDate = new Date();
    const warehouses =
      await this.warehouseRepository.getAllWarehousesInventories(currentDate);

    const snapshots = [];
    for (const warehouse of warehouses) {
      snapshots.push({
        warehouseId: warehouse.id,
        totalMaxAmount: warehouse.maxCapacity,
        occupiedAmount: calculateOccupiedArea(warehouse.inventories),
      });
    }

    return snapshots;
  }

  async getWarehouseById(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.getById(id);

    if (!warehouse) {
      const message = `Warehouse not found: ${id}`;
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    return warehouse;
  }
}
