import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';

export class GetProductsByCategory {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(category: string): Promise<Output> {
    const productsData = await this.productsRepository.getByCategory(category.toLowerCase());
    const products = [];
    for (const product of productsData) {
      products.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        summary: product.summary,
        categories: product.categories,
        imageUrl: product.imageUrl,
        releaseDate: product.getReleasedDate(),
      });
    }
    return products;
  }
}

export type Output = {
  productId: string;
  name: string;
  price: number;
  summary: string;
  categories: string[];
  imageUrl: string;
}[];

export const getProductsByCategoryParams = z.object({
  category: z.string({ required_error: 'category is required' }),
});
