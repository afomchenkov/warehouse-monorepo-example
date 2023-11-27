import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from '../entities/customer.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { Transaction } from '../entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Warehouse,
      Inventory,
      Product,
      Transaction,
    ]),
  ],
  controllers: [],
  providers: [],
})
export class DbModule {}
