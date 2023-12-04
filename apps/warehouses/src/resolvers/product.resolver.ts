import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Product } from '@app/common';
import { ProductService } from '../services';
import { CreateProductDto, DeleteProductDto, UpdateProductDto } from '../dtos';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query((returns) => [Product])
  async products(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Query((returns) => Product)
  async product(@Args('id') id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Mutation((returns) => Product, {
    description: 'create new product',
  })
  async createProduct(
    @Args('productData') productData: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(productData);
  }

  @Mutation(() => DeleteProductDto, {
    description:
      'delete product by ID (only if it is not assigned to inventory)',
  })
  async deleteProduct(
    @Args('productId') id: number,
  ): Promise<DeleteProductDto> {
    return this.productService.deleteProduct(id);
  }

  @Mutation(() => Product, {
    description:
      'update product (isHazardous/unitSize can be changed only if the product is not assigned to any warehouse)',
  })
  async updateProduct(
    @Args('productData') productData: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(productData);
  }
}
