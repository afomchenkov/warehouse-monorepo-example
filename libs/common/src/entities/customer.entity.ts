import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Warehouse } from './warehouse.entity';

@ObjectType({ description: 'customer entity' })
@Entity({ name: 'customers' })
export class Customer extends BaseEntity {
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
    name: 'username',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  @Field()
  username: string;

  @Column({ name: 'first_name' })
  @Field()
  firstName: string;

  @Column({ name: 'last_name' })
  @Field()
  lastName: string;

  @Column({
    name: 'email',
    nullable: false,
    unique: true,
  })
  @Field()
  email: string;

  @Column({ default: true, name: 'is_active' })
  @Field()
  isActive: boolean;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.owner)
  @Field(() => [Warehouse])
  warehouses: Warehouse[];
}
