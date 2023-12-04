import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';

enum TransactionType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

/**
 * - One transaction record per one product type
 * - One transaction record per one warehouse (a transaction record cannot be shared between many warehouses)
 */
@ObjectType({ description: 'transaction entity' })
@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  @Field(() => Int)
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  updatedAt: Date;

  @Column({
    name: 'transaction_type',
    enum: [TransactionType.IMPORT, TransactionType.EXPORT],
    nullable: false,
  })
  @Field(() => TransactionType)
  transactionType: string;

  @Column({
    name: 'quantity',
    type: 'integer',
    nullable: false,
  })
  @Field(() => Int)
  quantity: number;

  @Column({
    name: 'size',
    type: 'integer',
    nullable: false,
  })
  @Field(() => Int)
  size: number;

  @Column({
    name: 'transaction_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @Field(() => Date)
  transactionDate: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  @Field(() => Warehouse)
  warehouse: Warehouse;

  @ManyToOne(() => Product, (product) => product.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;
}
