import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  Length,
  IsNumber,
} from 'class-validator';

@InputType()
export class UpdateProductDto {
  @Field({ nullable: false })
  @IsNumber()
  id: number;

  @Field({ nullable: false })
  @IsNotEmpty({ message: 'name is missing' })
  @IsString()
  @Length(2, 70, { message: 'name length is invalid' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'description is missing' })
  @IsString()
  @Length(10, 1000, { message: 'description length is invalid' })
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isHazardous: boolean;

  @IsNotEmpty()
  @IsNumber()
  unitSize: number;
}
