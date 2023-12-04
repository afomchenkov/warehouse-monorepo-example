import { NotFoundException, Injectable, Logger } from '@nestjs/common';
import { Customer } from '@app/common';
import { CreateCustomerDto } from '../dtos';
import { CustomerRepository } from '../repositories';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly customerRepository: CustomerRepository) {}

  async getCustomers(): Promise<Customer[]> {
    return this.customerRepository.getAll();
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.getById(id);

    if (!customer) {
      const message = `Customer not found: ${id}`;
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    return customer;
  }

  async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.createCustomer(customerData);
  }
}
