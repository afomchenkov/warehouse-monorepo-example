import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Warehouse } from '@app/common';
import { CreateWarehouseDto } from '../dtos';
import { WarehouseRepository } from '../repositories';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver()
export class WarehouseResolver {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  @Query((returns) => [Warehouse])
  async warehouses(): Promise<Warehouse[]> {
    return this.warehouseRepository.getAll();
  }

  @Mutation((returns) => Warehouse, {
    description: 'create new warehouse',
  })
  async createProduct(
    @Args('warehouseData') warehouseData: CreateWarehouseDto,
  ): Promise<Warehouse> {
    return this.warehouseRepository.createWarehouse(warehouseData);
  }
}
