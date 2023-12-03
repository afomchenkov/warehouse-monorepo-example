import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Product } from '@app/common';
import { ProductRepository } from '../repositories';
import { CreateProductDto, UpdateProductDto } from '../dtos';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver()
export class ProductResolver {
  constructor(private readonly productRepository: ProductRepository) {}

  @Query((returns) => [Product])
  async products(): Promise<Product[]> {
    return this.productRepository.getAll();
  }

  @Query((returns) => Product)
  async product(@Args('id') id: number): Promise<Product> {
    return this.productRepository.getById(id);
  }

  @Mutation((returns) => Product, {
    description: 'create new product',
  })
  async createProduct(
    @Args('productData') productData: CreateProductDto,
  ): Promise<Product> {
    return this.productRepository.createProduct(productData);
  }

  @Mutation(() => Product, {
    description:
      'update product (isHazardous/unitSize can be changed only if the product is not assigned to any warehouse)',
  })
  updateProduct(
    @Args('productData') productData: UpdateProductDto,
  ): Promise<Product> {
    return this.productRepository.updateProduct(productData);
  }
}
