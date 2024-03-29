import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';
import { NotFoundError } from '../../errors/NotFound';

export class GetProductsBySlug {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(slug: string): Promise<Output> {
    const product = await this.productsRepository.getBySlug(slug);
    if (!product) throw new NotFoundError('Product not found');
    const categories = await this.productsRepository.getCategories(product.productId);
    return {
      productId: product.productId,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categories,
      imageUrl: product.imageUrl,
      releasedDate: product.getReleasedDate(),
      discountPercent: product.discount?.discountPercent ?? 0,
      active: product.discount?.active ?? false,
      rateAmount: product.rateAmount,
      totalScore: product.totalScore,
    };
  }
}

export type Output = {
  productId: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  imageUrl: string;
  releasedDate: Date | undefined;
  discountPercent: number;
  active: boolean;
  rateAmount: number;
  totalScore: number;
};

export const getProductsBySlugParams = z.object({
  slug: z.string({ required_error: 'slug is required' }),
});
