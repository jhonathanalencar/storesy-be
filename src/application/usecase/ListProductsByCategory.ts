import { ProductsRepository } from '../repository/ProductsRepository';

export class ListProductsByCategory {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(category: string): Promise<Output> {
    const productsData = await this.productsRepository.getByCategory(category);
    const products = [];
    for (const product of productsData) {
      products.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        summary: product.summary,
        categories: product.categories,
        imageUrl: product.imageUrl,
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
