import { DataSource, Repository, Between } from 'typeorm';
import { addDays } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { Customer, Warehouse } from '@app/common';
import { CreateWarehouseDto } from '../dtos';

@Injectable()
export class WarehouseRepository extends Repository<Warehouse> {
  constructor(private dataSource: DataSource) {
    super(Warehouse, dataSource.createEntityManager());
  }

  async createWarehouse(
    warehouseData: CreateWarehouseDto,
    customer: Customer,
  ): Promise<Warehouse> {
    const newWarehouse = this.create({ ...warehouseData, owner: customer });
    await this.save(newWarehouse);
    return newWarehouse;
  }

  // not implemented
  async updateWarehouse(): Promise<Warehouse> {
    return Promise.resolve(null);
  }

  // not implemented
  async deleteWarehouse(): Promise<void> {
    return Promise.resolve();
  }

  async getWarehouseInventories(
    warehouseId: number,
    date: Date,
  ): Promise<Warehouse> {
    return this.findOne({
      where: {
        id: warehouseId,
        inventories: {
          // should check without taking into account the time
          effectiveDate: Between(date, addDays(date, 1)),
        },
      },
    });
  }

  async getAllWarehousesInventories(date: Date): Promise<Warehouse[]> {
    return this.find({
      where: {
        inventories: {
          effectiveDate: Between(date, addDays(date, 1)),
        },
      },
    });
  }

  async getById(id: number): Promise<Warehouse | null> {
    return this.findOne({ where: { id: id } });
  }

  async getAllByOwnerId(customerId: number): Promise<Warehouse[]> {
    return this.find({
      where: {
        owner: {
          id: customerId,
        },
      },
    });
  }
}
