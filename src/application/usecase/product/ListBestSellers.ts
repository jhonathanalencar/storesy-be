import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';
import { SortedSet } from '../../../infra/cache/SortedSet';

export class ListBestSellers {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly sortedSet: SortedSet
  ) {}

  async execute(input: Input): Promise<Output> {
    const sortedSet: string[] = await this.sortedSet.getSortedSet(
      'products',
      input.offset,
      input.offset + input.limit - 1
    );
    const productIds = sortedSet.reduce((acc, value, index) => {
      if (index % 2 === 0) {
        acc.push(value);
      }
      return acc;
    }, [] as string[]);
    const [total, productsData] = await Promise.all([
      this.productsRepository.countBestSellers(),
      this.productsRepository.listBestSellers(productIds.join(), input.limit),
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
        rateAmount: product.rate_amount,
        totalScore: product.total_score,
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

export const listBestSellersQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
