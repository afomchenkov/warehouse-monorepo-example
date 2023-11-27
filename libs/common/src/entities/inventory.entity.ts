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
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';

/**
 * - One inventory record per one product type (an inventory record cannot have many assigned products)
 * - One inventory record per one warehouse (an inventory record cannot be shared between many warehouses)
 */
@Entity({ name: 'inventories' })
export class Inventory extends BaseEntity {
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
    name: 'effective_date',
    type: 'timestamptz',
    nullable: false,
  })
  effectiveDate: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Product, (product) => product.inventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
