import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Inventory } from './inventory.entity';
import { Transaction } from './transaction.entity';

/**
 * - A warehouse can have only one owner
 * - A warehouse can have many inventories for a given amount of time, satisfying the max size
 * - A warehouse can have many transaction records to keep the import/export history
 */
@Entity({ name: 'warehouses' })
export class Warehouse extends BaseEntity {
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

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'max_capacity' })
  maxCapacity: number;

  @ManyToOne(() => Customer, (customer) => customer.warehouses, {
    onDelete: 'CASCADE',
  })
  owner: Customer;

  @OneToMany(() => Transaction, (transaction) => transaction.warehouse)
  transactions: Transaction[];

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  inventories: Inventory[];
}
