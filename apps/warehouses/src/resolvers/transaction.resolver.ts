import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Transaction } from '@app/common';
import { TransactionInventoryService } from '../services';
import { CreateTransactionDto } from '../dtos';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver()
export class TransactionResolver {
  constructor(
    private readonly transactionInventoryService: TransactionInventoryService,
  ) {}

  @Query((returns) => [Transaction])
  async transactionsHistoryByWarehouse(
    @Args('warehouseId') id: number,
  ): Promise<Transaction[]> {
    return this.transactionInventoryService.getTransactionsHistoryByWarehouse(
      id,
    );
  }

  @Query((returns) => [Transaction])
  async transactionsHistoryByDate(
    @Args('warehouseId') id: number,
    @Args('from') from: string,
    @Args('to') to: string,
  ): Promise<Transaction[]> {
    // Date/Time Zulu Format: 2017-10-13T00:00:00Z - standard ISO 8601
    return this.transactionInventoryService.getTransactionsHistoryByDate(
      id,
      from,
      to,
    );
  }

  @Mutation((returns) => Transaction, {
    description: 'create new transaction (import/export)',
  })
  async createCustomer(
    @Args('transactionData') transactionData: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionInventoryService.submitTransaction(transactionData);
  }
}
