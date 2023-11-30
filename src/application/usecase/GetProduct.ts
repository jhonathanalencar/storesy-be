import { ProductsRepository } from '../repository/ProductsRepository';

export class GetProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(productId: string): Promise<Output> {
    const product = await this.productsRepository.getById(productId);
    return {
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: product.price,
      categories: product.categories,
      imageUrl: product.imageUrl,
      releaseDate: product.getReleaseDate(),
    };
  }
}

export type Output = {
  productId: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  imageUrl: string;
  releaseDate: Date | undefined;
};
