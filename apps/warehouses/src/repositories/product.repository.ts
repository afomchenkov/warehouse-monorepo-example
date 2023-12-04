import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '@app/common';
import { CreateProductDto, DeleteProductDto, UpdateProductDto } from '../dtos';

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

  async updateProduct(
    productData: UpdateProductDto,
    existingProduct: Product,
  ): Promise<Product> {
    delete productData.id;
    const updateProductDataObject: object = {
      ...existingProduct,
      ...productData,
    };

    const updateProductDataQuery = await this.preload(updateProductDataObject);
    return this.save(updateProductDataQuery);
  }

  async deleteProduct(id: number): Promise<DeleteProductDto> {
    await this.delete(id);
    return {
      id,
    };
  }

  async getAll(): Promise<Product[]> {
    return this.find();
  }

  async getById(id: number): Promise<Product | null> {
    return this.findOne({ where: { id: id } });
  }
}
