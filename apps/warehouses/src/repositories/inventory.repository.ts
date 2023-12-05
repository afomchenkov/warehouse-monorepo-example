import { DataSource, Repository, Raw } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Inventory } from '@app/common';

@Injectable()
export class InventoryRepository extends Repository<Inventory> {
  constructor(private dataSource: DataSource) {
    super(Inventory, dataSource.createEntityManager());
  }

  async getAllActiveByProductId(productId: number): Promise<Inventory[]> {
    return this.find({
      where: {
        effectiveDate: Raw((alias) => `${alias} >= NOW()`),
        product: {
          id: productId,
        },
      },
    });
  }
}
