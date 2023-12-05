import { IsNotEmpty, IsEnum, IsString } from 'class-validator';

export enum CalculationStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class CalculationResponseDto {
  @IsNotEmpty()
  @IsEnum(CalculationStatus)
  status: string;

  @IsNotEmpty()
  @IsString()
  calculationMessage: string;
}
