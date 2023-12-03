import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

@InputType()
export class CreateWarehouseDto {
  @Field()
  @IsNotEmpty({ message: 'name is missing' })
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty({ message: 'description is missing' })
  @IsString()
  @Length(10, 3000, { message: 'description length is invalid' })
  description: string;

  @Field()
  @IsNotEmpty({ message: 'location is missing' })
  @IsString()
  @Length(10, 100, { message: 'location length is invalid' })
  location: string;

  @Field()
  @IsNotEmpty({ message: 'maxCapacity is missing' })
  @IsNumber()
  maxCapacity: number;

  @Field()
  @IsNotEmpty({ message: 'customerId is missing' })
  @IsNumber()
  customerId: number;
}
