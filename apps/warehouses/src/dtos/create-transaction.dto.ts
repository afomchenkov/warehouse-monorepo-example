import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransactionType } from '@app/common';

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsNotEmpty({ message: 'transactionType is missing' })
  @Transform(({ value }) => String(value).toUpperCase())
  @IsEnum(TransactionType)
  transactionType: string;

  @Field()
  @IsNotEmpty({ message: 'quantity is missing' })
  @IsNumber()
  quantity: number;

  @Field()
  @IsNotEmpty({ message: 'size is missing' })
  @IsNumber()
  size: number;

  @Field()
  @IsNotEmpty({ message: 'transactionDate is missing' })
  @IsString()
  transactionDate: string;

  @Field()
  @IsNotEmpty({ message: 'warehouseId is missing' })
  @IsNumber()
  warehouseId: number;

  @Field()
  @IsNotEmpty({ message: 'productId is missing' })
  @IsNumber()
  productId: number;
}
