import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StockSnapshotDto {
  @Field(() => Int)
  warehouseId: number;

  @Field(() => Int)
  totalMaxAmount: number;

  @Field(() => Int)
  occupiedAmount: number;
}
