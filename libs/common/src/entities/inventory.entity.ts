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
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';

/**
 * - One inventory record per one product type (an inventory record cannot have many assigned products)
 * - One inventory record per one warehouse (an inventory record cannot be shared between many warehouses)
 * - Many inventories can be created for a warehouse per a separate product:
 *   - inventory(warehouseA, productA, quantity10)
 *   - inventory(warehouseA, productB, quantity89)
 *   - inventory(warehouseA, productE, quantity3)
 */
@ObjectType({ description: 'inventory entity' })
@Entity({ name: 'inventories' })
export class Inventory extends BaseEntity {
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
    name: 'effective_date',
    type: 'timestamptz',
    nullable: false,
  })
  @Field(() => Date)
  effectiveDate: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  @Field(() => Warehouse)
  warehouse: Warehouse;

  @ManyToOne(() => Product, (product) => product.inventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;
}
