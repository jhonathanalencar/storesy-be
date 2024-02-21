import { z } from 'zod';

import { Product } from '../../../domain/entity/Product';
import { ProductsRepository } from '../../repository/ProductsRepository';

export class AddProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const newProduct = Product.create(
      input.name,
      input.description,
      input.price,
      input.categories,
      input.imageUrl,
      input.quantity,
      input.discountId
    );
    await this.productsRepository.save(newProduct);
    return { productId: newProduct.productId };
  }
}

export type Input = {
  name: string;
  description: string;
  price: number;
  categories: string[];
  imageUrl: string;
  quantity: number;
  discountId?: string;
};

export type Output = {
  productId: string;
};

export const createProductBody = z.object({
  name: z.string({ required_error: 'name is required' }).trim().min(1, 'name is required'),
  description: z
    .string({ required_error: 'description is required' })
    .trim()
    .min(1, 'description is required'),
  price: z.number({ required_error: 'price is required' }),
  categories: z
    .array(z.string(), { required_error: 'categories is required' })
    .length(1, 'categories is required'),
  imageUrl: z.string({ required_error: 'imageUrl is required' }).url(),
  quantity: z.number({ required_error: 'quantity is required' }).int(),
  discountId: z.string().uuid('discountId is not a valid uuid').optional(),
});
