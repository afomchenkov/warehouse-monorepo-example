import { DataSource, Between } from 'typeorm';
import { addMonths } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { Inventory, Warehouse } from '@app/common';

@Injectable()
export class CalculationsRepository {
  constructor(private dataSource: DataSource) {}

  async getInventories(): Promise<Inventory[]> {
    return this.dataSource.getRepository(Inventory).find();
  }

  async getWarehouses(): Promise<Warehouse[]> {
    // this.dataSource
    //   .getRepository(Warehouse)
    //   .manager.transaction(async (transactionalEntityManager) => {
    //     await transactionalEntityManager.save(warehouse)
    //     await transactionalEntityManager.save(transaction)
    //   })

    return this.dataSource.getRepository(Warehouse).find();
  }
}
