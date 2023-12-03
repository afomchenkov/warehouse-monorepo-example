import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Customer } from '@app/common';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

@Injectable()
export class CustomerRepository extends Repository<Customer> {
  constructor(private dataSource: DataSource) {
    super(Customer, dataSource.createEntityManager());
  }

  async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
    const newCustomer = this.create({
      ...customerData,
    });
    await this.save(newCustomer);
    return newCustomer;
  }

  // not implemented
  async updateCustomer(): Promise<void> {
    return Promise.resolve();
  }

  // not implemented
  async deleteCustomer(): Promise<void> {
    return Promise.resolve();
  }

  async getAll(): Promise<Customer[]> {
    return this.find();
  }

  async getById(id: number): Promise<Customer | null> {
    return this.findOne({ where: { id: id } });
  }

  async getByUsername(username: string): Promise<Customer | null> {
    return this.findOne({
      select: { username: true },
      where: { username: username },
    });
  }
}
