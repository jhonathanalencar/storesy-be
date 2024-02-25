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
      parseInt(input.start),
      parseInt(input.stop)
    );
    const productIds = sortedSet.reduce((acc, value, index) => {
      if (index % 2 === 0) {
        acc.push(value);
      }
      return acc;
    }, [] as string[]);
    const products = await this.productsRepository.listBestSellers(productIds.join());
    return products.map((product) => {
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
      };
    });
  }
}

export type Input = {
  start: string;
  stop: string;
};

export type Output = {
  productId: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  imageUrl: string;
  quantity: number;
  releasedDate: Date | undefined;
}[];

export const listBestSellersQuery = z.object({
  start: z.string({ required_error: 'start is required' }),
  stop: z.string({ required_error: 'stop is required' }),
});
