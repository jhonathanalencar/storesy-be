import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';

export class SearchProducts {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const products = await this.productsRepository.search(input.query);
    return products.map((product) => {
      return {
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        imageUrl: product.imageUrl,
        releasedDate: product.getReleasedDate(),
        active: product.discount?.active ?? false,
        discountPercent: product.discount?.discountPercent ?? 0,
        rateAmount: product.rate_amount,
        totalScore: product.total_score,
      };
    });
  }
}

type Input = {
  query: string;
};

type Output = {
  productId: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  releasedDate: Date | undefined;
  discountPercent: number;
  active: boolean;
  rateAmount: number;
  totalScore: number;
}[];

export const searchProductsQuery = z.object({
  query: z.string({ required_error: 'query is required' }),
});
