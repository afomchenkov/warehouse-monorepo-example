import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Inventory } from './inventory.entity';
import { Transaction } from './transaction.entity';

/**
 * - A product record can be assigned to many transactions
 * - A product record can be assigned to many inventories
 */
@ObjectType({ description: 'product entity' })
@Entity({ name: 'products' })
export class Product extends BaseEntity {
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

  @Column({ default: false, name: 'is_hazardous' })
  @Field()
  isHazardous: boolean;

  @Column({ default: true, name: 'is_active' })
  @Field()
  isActive: boolean;

  @Column({ name: 'unit_size', type: 'integer' })
  @Field(() => Int)
  unitSize: number;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  @Field(() => [Transaction])
  transactions: Transaction[];

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  @Field(() => [Inventory])
  inventories: Inventory[];
}
