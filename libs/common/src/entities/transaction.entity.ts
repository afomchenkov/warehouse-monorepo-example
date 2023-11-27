import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';

/**
 * - One transaction record per one product type
 * - One transaction record per one warehouse (a transaction record cannot be shared between many warehouses)
 */
@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'transaction_type',
    enum: ['IMPORT', 'EXPORT'],
    nullable: false,
  })
  transactionType: string;

  @Column({
    name: 'quantity',
    type: 'integer',
    nullable: false,
  })
  quantity: number;

  @Column({
    name: 'size',
    type: 'integer',
    nullable: false,
  })
  size: number;

  @Column({
    name: 'transaction_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  transactionDate: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.transactions, {
    onDelete: 'CASCADE',
  })
  warehouse: Warehouse;

  @ManyToOne(() => Product, (product) => product.transactions, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
