import { DataSource, Repository, Raw, Between } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@app/common';
import { CreateTransactionDto } from '../dtos';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  // Import/Export operation for a specific product/warehouse
  async createTransaction(
    transactionData: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction = this.create({
      ...transactionData,
    });
    await this.save(newTransaction);
    return newTransaction;
  }

  // not implemented
  async updateTransaction(): Promise<Transaction> {
    return Promise.resolve(null);
  }

  // not implemented
  async deleteTransaction(): Promise<void> {
    return Promise.resolve();
  }

  // TODO: by default set the start date from today
  async getAll(): Promise<Transaction[]> {
    return this.find();
  }

  async getAllByWarehouseId(id: number): Promise<Transaction[]> {
    return this.find({
      where: {
        warehouse: {
          id: id,
        },
      },
      order: {
        transactionDate: 'ASC',
      },
    });
  }

  async getTransactionsHistoryByWarehouse(
    warehouseId: number,
  ): Promise<Transaction[]> {
    return this.find({
      where: {
        // query all transactions till the current day
        transactionDate: Raw((alias) => `${alias} < NOW()`),
        warehouse: {
          id: warehouseId,
        },
      },
      order: {
        transactionDate: 'ASC',
      },
    });
  }

  async getTransactionsHistoryByDate(
    warehouseId: number,
    from: Date,
    to: Date,
  ): Promise<Transaction[]> {
    return this.find({
      where: {
        transactionDate: Between(from, to),
        warehouse: {
          id: warehouseId,
        },
      },
      order: {
        transactionDate: 'ASC',
      },
    });
  }

  async getById(id: number): Promise<Transaction | null> {
    return this.findOne({ where: { id: id } });
  }
}
