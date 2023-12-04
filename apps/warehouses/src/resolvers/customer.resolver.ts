import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Customer } from '@app/common';
import { CustomerService } from '../services';
import { CreateCustomerDto } from '../dtos';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query((returns) => [Customer])
  async customers(): Promise<Customer[]> {
    return this.customerService.getCustomers();
  }

  @Query((returns) => Customer)
  async customer(@Args('id') id: number): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Mutation((returns) => Customer, {
    description: 'create new customer',
  })
  async createCustomer(
    @Args('customerData') customerData: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.createCustomer(customerData);
  }
}
