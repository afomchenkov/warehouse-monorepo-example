import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '@app/common';
import { CreateProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const newProduct = this.create({ ...productData });
    await this.save(newProduct);
    return newProduct;
  }

  async updateProduct(productData: UpdateProductDto): Promise<Product> {
    const { id } = productData;
    const product = await this.getById(id);
    // check if a product is assigned at least to one of the warehouses and reject an update
    return product;
  }

  // not implemented
  async deleteProduct(): Promise<void> {
    return Promise.resolve();
  }

  async getAll(): Promise<Product[]> {
    return this.find();
  }

  async getById(id: number): Promise<Product | null> {
    return this.findOne({ where: { id: id } });
  }
}
