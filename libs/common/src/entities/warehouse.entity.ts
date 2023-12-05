import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Customer } from './customer.entity';
import { Inventory } from './inventory.entity';
import { Transaction } from './transaction.entity';

/**
 * - A warehouse can have only one owner
 * - A warehouse can have many inventories for a given amount of time, satisfying the max size
 * - A warehouse can have many transaction records to keep the import/export history
 */
@ObjectType({ description: 'warehouse entity' })
@Entity({ name: 'warehouses' })
export class Warehouse extends BaseEntity {
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

  // keep soft delete
  @CreateDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  @Field()
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
  })
  @Field()
  description: string;

  @Column({ name: 'location' })
  @Field()
  location: string;

  @Column({ name: 'max_capacity' })
  @Field(() => Int)
  maxCapacity: number;

  @ManyToOne(() => Customer, (customer) => customer.warehouses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  @Field(() => Customer)
  owner: Customer;

  @OneToMany(() => Transaction, (transaction) => transaction.warehouse)
  @Field(() => [Transaction])
  transactions: Transaction[];

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  @Field(() => [Inventory])
  inventories: Inventory[];
}
