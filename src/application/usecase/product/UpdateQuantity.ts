import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';
import { NotFoundError } from '../../errors/NotFound';
import { Product } from '../../../domain/entity/Product';
import { BadRequestError } from '../../errors/BadRequest';

export class UpdateProductQuantity {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<void> {
    const product = await this.productsRepository.getById(input.productId);
    if (!product) throw new NotFoundError('Product not found');
    const updatedProduct = Product.restore(
      input.productId,
      product.name,
      product.slug,
      product.description,
      product.summary,
      product.price,
      product.categories,
      product.imageUrl,
      product.quantity - input.quantity,
      product.createdAt,
      product.updatedAt,
      product.discountId,
      product.getReleasedDate()
    );
    if (updatedProduct.quantity < 0) {
      throw new BadRequestError('quantity cannot be negative');
    }
    await this.productsRepository.updateQuantity(updatedProduct);
  }
}

export type Input = {
  productId: string;
  quantity: number;
};

export const updateProductQuantityParams = z.object({
  productId: z
    .string({ required_error: 'productId is required' })
    .uuid('productId is not a valid uuid'),
});

export const updateProductQuantityBody = z.object({
  quantity: z
    .number({ required_error: 'quantity is required' })
    .positive('quantity must be greater than 0'),
});
