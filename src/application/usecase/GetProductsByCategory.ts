import { ProductsRepository } from '../repository/ProductsRepository';

export class GetProductsByCategory {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(category: string): Promise<Output> {
    const productsData = await this.productsRepository.getByCategory(
      category.toLowerCase()
    );
    const products = [];
    for (const product of productsData) {
      products.push({
        productId: product.product_id,
        name: product.name,
        price: product.price,
        summary: product.summary,
        categories: product.categories,
        imageUrl: product.image_url,
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
