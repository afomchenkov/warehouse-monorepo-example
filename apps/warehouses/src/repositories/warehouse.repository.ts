import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Warehouse, Customer } from '@app/common';
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
