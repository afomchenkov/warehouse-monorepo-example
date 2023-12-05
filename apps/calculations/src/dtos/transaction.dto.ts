import { IsNotEmpty, IsEnum, IsString, IsNumber } from 'class-validator';

export enum TransactionType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

export class TransactionDto {
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transactionType: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsString()
  transactionDate: string;

  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
