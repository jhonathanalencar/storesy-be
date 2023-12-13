import { ProductsRepository } from '../repository/ProductsRepository';

export class GetProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(productId: string): Promise<Output> {
    const product = await this.productsRepository.getById(productId);
    return {
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      categories: product.categories,
      image_url: product.image_url,
      released_date: product.getReleasedDate(),
    };
  }
}

export type Output = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  image_url: string;
  released_date: Date | undefined;
};
