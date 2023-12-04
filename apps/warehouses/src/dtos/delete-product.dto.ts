import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteProductDto {
  @Field(() => Int)
  id: number;
}
