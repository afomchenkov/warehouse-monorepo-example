import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { Product, Inventory } from '@app/common';
import { ProductRepository } from '../repositories';
import { TransactionInventoryService } from './transaction-inventory.service';
import { CreateProductDto, DeleteProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly transactionInventoryService: TransactionInventoryService,
  ) {}

  async createProduct(productData: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(productData);
  }

  async updateProduct(productData: UpdateProductDto): Promise<Product> {
    const { id } = productData;
    const existingProduct = await this.getProductById(id);

    // check if a product is assigned to at least one active inventory and reject an update
    const activeProductInventories = await this.getProductInventories(id);
    if (activeProductInventories.length > 0) {
      throw new BadRequestException(`Cannot update active product: ${id}`);
    }

    const updatedProduct = await this.productRepository.updateProduct(
      productData,
      existingProduct,
    );
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<DeleteProductDto> {
    // check if a product is assigned to at least one active inventory and reject an update
    await this.getProductById(id);
    const activeProductInventories = await this.getProductInventories(id);
    if (activeProductInventories.length > 0) {
      throw new BadRequestException(`Cannot delete active product: ${id}`);
    }

    return this.productRepository.deleteProduct(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: id } });

    if (!product) {
      throw new NotFoundException(`Product not found: ${id}`);
    }

    return product;
  }

  async getProductInventories(productId: number): Promise<Inventory[]> {
    return this.transactionInventoryService.getActiveProductInventories(
      productId,
    );
  }
}
