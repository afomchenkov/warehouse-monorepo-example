import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Warehouse } from '@app/common';
import { CreateWarehouseDto, StockSnapshotDto } from '../dtos';
import { WarehouseService } from '../services';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver()
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query((returns) => [Warehouse])
  async warehousesByOwner(
    @Args('customerId') customerId: number,
  ): Promise<Warehouse[]> {
    return this.warehouseService.getAllByOwnerId(customerId);
  }

  @Query((returns) => StockSnapshotDto)
  async warehouseCurrentStockSnapshot(
    @Args('warehouseId') warehouseId: number,
  ): Promise<StockSnapshotDto> {
    return this.warehouseService.getWarehouseCurrentStockSnapshot(warehouseId);
  }

  @Query((returns) => [StockSnapshotDto])
  async allWarehousesCurrentStockSnapshots(): Promise<StockSnapshotDto[]> {
    return this.warehouseService.getAllWarehousesCurrentStockSnapshots();
  }

  @Mutation((returns) => Warehouse, {
    description: 'create new warehouse',
  })
  async createWarehouse(
    @Args('warehouseData') warehouseData: CreateWarehouseDto,
  ): Promise<Warehouse> {
    return this.warehouseService.createWarehouse(warehouseData);
  }
}
