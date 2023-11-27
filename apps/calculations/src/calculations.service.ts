import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculationsService {
  getHello(): string {
    return 'calculations running...';
  }
}
