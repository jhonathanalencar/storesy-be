import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';

export class GetProductsByCategory {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(category: string): Promise<Output> {
    const productsData = await this.productsRepository.getByCategory(category);
    const products: Output = [];
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
    return products;
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
}[];

export const getProductsByCategoryParams = z.object({
  category: z.string({ required_error: 'category is required' }),
});
