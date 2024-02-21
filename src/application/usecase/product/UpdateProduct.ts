import { z } from 'zod';

import { Product } from '../../../domain/entity/Product';
import { NotFoundError } from '../../errors/NotFound';
import { ProductsRepository } from '../../repository/ProductsRepository';

export class UpdateProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<void> {
    const product = await this.productsRepository.getById(input.productId);
    if (!product) throw new NotFoundError('Product not found');
    const updatedProduct = Product.restore(
      input.productId,
      input.name,
      product.slug,
      input.description,
      input.summary,
      input.price,
      product.categories,
      input.imageUrl,
      input.quantity,
      product.createdAt,
      product.updatedAt,
      input.discountId,
      product.getReleasedDate()
    );
    await this.productsRepository.update(updatedProduct);
  }
}

export type Input = {
  productId: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  categories: string[];
  imageUrl: string;
  quantity: number;
  discountId?: string;
};

export const updateProductParams = z.object({
  productId: z
    .string({ required_error: 'productId is required' })
    .uuid('productId is not a valid uuid'),
});

export const updateProductBody = z.object({
  name: z.string({ required_error: 'name is required' }).trim().min(1, 'name is required'),
  description: z
    .string({ required_error: 'description is required' })
    .trim()
    .min(1, 'description is required'),
  summary: z.string({ required_error: 'summary is required' }).trim().min(1, 'summary is required'),
  price: z.number({ required_error: 'price is required' }),
  categories: z
    .array(z.string(), { required_error: 'categories is required' })
    .length(1, 'categories is required'),
  imageUrl: z.string({ required_error: 'imageUrl is required' }).url(),
  quantity: z.number({ required_error: 'quantity is required' }).int(),
  discountId: z.string().uuid('discountId is not a valid uuid').optional(),
});
