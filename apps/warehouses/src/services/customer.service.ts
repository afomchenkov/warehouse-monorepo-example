import { NotFoundException, Injectable } from '@nestjs/common';
import { Customer } from '@app/common';
import { CreateCustomerDto } from '../dtos';
import { CustomerRepository } from '../repositories';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async getCustomers(): Promise<Customer[]> {
    return this.customerRepository.getAll();
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.getById(id);

    if (!customer) {
      throw new NotFoundException(`Customer not found: ${id}`);
    }

    return customer;
  }

  async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.createCustomer(customerData);
  }
}
