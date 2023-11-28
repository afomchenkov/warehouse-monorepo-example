import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WarehousesService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'warehouses running...';
  }

  async callCalculation(): Promise<string> {
    try {
      const response = await this.httpService.axiosRef.get(
        'http://calculations:3001/another',
      );
      return `from warehouses: ${response.data}`;
    } catch (error) {
      console.log(error);
      return JSON.stringify(error);
    }
  }
}
