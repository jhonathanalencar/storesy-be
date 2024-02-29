import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';

export class GetProductsByCategory {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const [total, productsData] = await Promise.all([
      this.productsRepository.countCategory(input.category),
      this.productsRepository.getByCategory(input.category, input.limit, input.offset),
    ]);
    const products: Output['products'] = [];
    for (const product of productsData) {
      products.push({
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        categories: product.categories,
        imageUrl: product.imageUrl,
        releasedDate: product.getReleasedDate(),
        active: product.discount?.active ?? false,
        discountPercent: product.discount?.discountPercent ?? 0,
        rateAmount: product.rate_amount,
        totalScore: product.total_score,
      });
    }
    return {
      total,
      products,
    };
  }
}

type Input = {
  category: string;
  limit: number;
  offset: number;
};

export type Output = {
  total: number;
  products: {
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
  }[];
};

export const getProductsByCategoryParams = z.object({
  category: z.string({ required_error: 'category is required' }),
});

export const getProductsByCategoryQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
