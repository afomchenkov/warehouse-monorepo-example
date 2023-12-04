import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Customer } from '@app/common';

@Injectable()
export class CalculationsRepository {
  constructor(private dataSource: DataSource) {}

  async getCustomers(): Promise<Customer[]> {
    return await this.dataSource.getRepository(Customer).find();
  }

  // add necessary queries
}
