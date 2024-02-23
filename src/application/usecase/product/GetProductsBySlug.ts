import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';
import { NotFoundError } from '../../errors/NotFound';

export class GetProductsBySlug {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(slug: string): Promise<Output> {
    const product = await this.productsRepository.getBySlug(slug);
    if (!product) throw new NotFoundError('Product not found');
    return {
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categories: product.categories,
      imageUrl: product.imageUrl,
      releasedDate: product.getReleasedDate(),
      discountPercent: product.discount?.discountPercent ?? 0,
      active: product.discount?.active ?? false,
      ratings: product.ratings.map((rate) => {
        return {
          rateId: rate.rateId,
          description: rate.content,
          score: rate.rate,
          userId: rate.userId,
          editedAt: rate.editedAt,
          postedAt: rate.postedAt,
        };
      }),
    };
  }
}

export type Output = {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  imageUrl: string;
  releasedDate: Date | undefined;
  discountPercent: number;
  active: boolean;
  ratings: {
    rateId: string;
    score: number;
    description: string;
    userId: string;
    postedAt: Date;
    editedAt: Date;
  }[];
};

export const getProductsBySlugParams = z.object({
  slug: z.string({ required_error: 'slug is required' }),
});
