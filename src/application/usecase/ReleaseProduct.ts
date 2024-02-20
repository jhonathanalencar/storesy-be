import { z } from 'zod';

import { NotFoundError } from '../errors/NotFound';
import { ProductsRepository } from '../repository/ProductsRepository';

export class ReleaseProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(productId: string): Promise<void> {
    const product = await this.productsRepository.getById(productId);
    if (!product) throw new NotFoundError('Product not found');
    product.release();
    await this.productsRepository.update(product);
  }
}

export const releaseProductParams = z.object({
  productId: z
    .string({ required_error: 'productId is required' })
    .uuid('productId is not a valid uuid'),
});
