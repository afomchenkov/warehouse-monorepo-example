import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Customer } from '@app/common';
import { CustomerRepository } from '../repositories';
import { CreateCustomerDto } from '../dtos';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver()
export class CustomerResolver {
  constructor(private readonly customerRepository: CustomerRepository) {}

  @Query((returns) => [Customer])
  async customers(): Promise<Customer[]> {
    return this.customerRepository.getAll();
  }

  @Query((returns) => Customer)
  async customer(@Args('id') id: number): Promise<Customer> {
    return this.customerRepository.getById(id);
  }

  @Mutation((returns) => Customer, {
    description: 'create new customer',
  })
  async createCustomer(
    @Args('customerData') customerData: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerRepository.createCustomer(customerData);
  }
}
