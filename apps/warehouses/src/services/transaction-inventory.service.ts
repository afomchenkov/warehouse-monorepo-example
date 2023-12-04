import { Injectable } from '@nestjs/common';
import { Inventory } from '@app/common';
import { TransactionRepository, InventoryRepository } from '../repositories';

@Injectable()
export class TransactionInventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getActiveProductInventories(productId: number): Promise<Inventory[]> {
    return this.inventoryRepository.getAllActiveByProductId(productId);
  }
}
