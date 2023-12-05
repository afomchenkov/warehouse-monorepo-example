import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { differenceInMonths } from 'date-fns';
import { HttpService } from '@nestjs/axios';
import { Inventory, Transaction } from '@app/common';
import {
  ProductRepository,
  InventoryRepository,
  TransactionRepository,
  WarehouseRepository,
} from '../repositories';
import { CreateTransactionDto, TransactionType } from '../dtos';
import { toDateFormat } from '../utils';

enum CalculationStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Injectable()
export class TransactionInventoryService {
  private readonly logger = new Logger(TransactionInventoryService.name);

  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly httpService: HttpService,
    private readonly productRepository: ProductRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly warehouseRepository: WarehouseRepository,
  ) {}

  async getActiveProductInventories(productId: number): Promise<Inventory[]> {
    return this.inventoryRepository.getAllActiveByProductId(productId);
  }

  async getTransactionsHistoryByWarehouse(
    warehouseId: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getTransactionsHistoryByWarehouse(
      warehouseId,
    );
  }

  async getTransactionsHistoryByDate(
    warehouseId: number,
    from: string,
    to: string,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getTransactionsHistoryByDate(
      warehouseId,
      toDateFormat(from),
      toDateFormat(to),
    );
  }

  /**
   * On transaction submit the following steps are taken:
   * - validate that the transaction properties have the corresponding data records: [product, warehouse]
   * - validate transactionDate, it must not be greater than one month ahead from now() for imports
   * - transactionDate cannot be in the past
   * - send request to calculations service to calculate possible inventory changes:
   *    - if the response from the calculations service is ACCEPTED, we save the transaction and commit the changes
   *    - if the response is REJECTED, the transaction cannot be saved as there is a mismatch in calculated inventory
   * - transaction can be saved only if the corresponding inventory re-calculated and accepted
   */
  async submitTransaction(
    transactionData: CreateTransactionDto,
  ): Promise<Transaction> {
    const { productId, warehouseId, transactionType, transactionDate } =
      transactionData;

    const product = await this.productRepository.getById(productId);
    if (!product) {
      const message = `Product for transaction not found: ${productId}`;
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    const warehouse = await this.warehouseRepository.getById(warehouseId);
    if (!warehouse) {
      const message = `Warehouse for transaction not found: ${warehouseId}`;
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    const dateLeft = new Date();
    const dateRight = new Date(transactionDate);
    const dateDiff = differenceInMonths(dateLeft, dateRight);

    if (dateRight < dateLeft) {
      const message = `The import/export date cannot be in the past`;
      this.logger.debug(message);
      throw new BadRequestException(message);
    }

    if (
      transactionType === TransactionType.IMPORT &&
      Math.abs(dateDiff) !== 0
    ) {
      const message = `The future import date cannot be more than a month ahead`;
      this.logger.debug(message);
      throw new BadRequestException(message);
    }

    // TODO: check if a product hazardous or not and which products warehouse stores
    // throw the corresponding exception

    try {
      const {
        // TODO: return more info on the calculation result
        data: { status, calculationMessage /**, payload */ },
      } = await this.httpService.axiosRef.post(
        process.env.CALCULATE_INVENTORY_URL,
        transactionData,
        {
          headers: {
            'Service-Version': '1',
          },
        },
      );

      if (status === CalculationStatus.ACCEPTED) {
        // commit transaction
        // TODO: ideally the whole operation must be moved to calculation service
        // or SQL transaction: check calculation -> [update inventory, create transaction])
        // or add Stored Procedure to do a daily update
        return this.transactionRepository.createTransaction(transactionData);
      }
      if (status === CalculationStatus.REJECTED) {
        const message = `Calculation result error: ${calculationMessage}`;
        this.logger.error(message);
        throw new BadRequestException(message);
      }
    } catch (error) {
      const message = `Calculation service error: ${error.message}`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }
  }
}
