import { IsNotEmpty, IsEnum, IsString, IsNumber } from 'class-validator';
import { CalculationStatus } from '@app/common';

export class CalculationResponseDto {
  @IsNotEmpty()
  @IsEnum(CalculationStatus)
  status: string;

  @IsNotEmpty()
  @IsString()
  calculationMessage: string;

  @IsNotEmpty()
  @IsNumber()
  transactionId: number;
}
