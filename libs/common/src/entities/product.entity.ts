import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';
import { Transaction } from './transaction.entity';

/**
 * - A product record can be assigned to many transactions
 * - A product record can be assigned to many inventories
 */
@Entity({ name: 'products' })
export class Product extends BaseEntity {
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
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({ default: false, name: 'is_hazardous' })
  isHazardous: boolean;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'unit_size', type: 'integer' })
  unitSize: number;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories: Inventory[];
}
