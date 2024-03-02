import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';

export class ListDeals {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const [total, productsData] = await Promise.all([
      this.productsRepository.countDeals(),
      this.productsRepository.listDeals(input.limit, input.offset),
    ]);
    const products = productsData.map((product) => {
      return {
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        quantity: product.quantity,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        categories: product.categories,
        releasedDate: product.getReleasedDate(),
        discountPercent: product.discount?.discountPercent ?? 0,
        active: product.discount?.active ?? false,
        rateAmount: product.rateAmount,
        totalScore: product.totalScore,
      };
    });
    return {
      total,
      products,
    };
  }
}

export type Input = {
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
    categories: string[];
    imageUrl: string;
    quantity: number;
    releasedDate: Date | undefined;
    discountPercent: number;
    active: boolean;
    rateAmount: number;
    totalScore: number;
  }[];
};

export const listDealsQuery = z.object({
  limit: z.string().optional(),
  page: z.string().optional(),
});
