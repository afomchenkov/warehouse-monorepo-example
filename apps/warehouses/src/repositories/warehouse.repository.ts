import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Warehouse } from '@app/common';
import { CreateWarehouseDto } from '../dtos';

@Injectable()
export class WarehouseRepository extends Repository<Warehouse> {
  constructor(private dataSource: DataSource) {
    super(Warehouse, dataSource.createEntityManager());
  }

  async createWarehouse(warehouseData: CreateWarehouseDto): Promise<Warehouse> {
    const newWarehouse = this.create({ ...warehouseData });
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

  async getAll(): Promise<Warehouse[]> {
    return this.find();
  }

  async getById(id: number): Promise<Warehouse | null> {
    return this.findOne({ where: { id: id } });
  }
}
