import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Warehouse } from '@app/common';
import { WarehouseRepository } from '../repositories';
import { CustomerService } from './customer.service';
import { CreateWarehouseDto } from '../dtos';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly warehouseRepository: WarehouseRepository,
    private readonly customerService: CustomerService,
  ) {}

  async getAllByOwnerId(customerId: number): Promise<Warehouse[]> {
    // validate if the customer exists
    await this.customerService.getCustomerById(customerId);
    return this.warehouseRepository.getAllByOwnerId(customerId);
  }

  async createWarehouse(warehouseData: CreateWarehouseDto): Promise<Warehouse> {
    const { customerId } = warehouseData;
    const customer = await this.customerService.getCustomerById(customerId);
    return this.warehouseRepository.createWarehouse(warehouseData, customer);
  }

  async callCalculation(): Promise<string> {
    try {
      const response = await this.httpService.axiosRef.get(
        'http://calculations:3001/api/calculate-inventory',
        {
          headers: {
            'Service-Version': '1',
          },
        },
      );
      return `from warehouses: calculations::[${response.data}]`;
    } catch (error) {
      console.log(error);
      return JSON.stringify(error);
    }
  }
}
