import { NotFoundError } from '../errors/NotFound';
import { ProductsRepository } from '../repository/ProductsRepository';

export class GetProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(productId: string): Promise<Output> {
    const product = await this.productsRepository.getById(productId);
    if (!product) throw new NotFoundError('Product not found');
    return {
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categories: product.categories,
      imageUrl: product.imageUrl,
      releasedDate: product.getReleasedDate(),
    };
  }
}

export type Output = {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  imageUrl: string;
  releasedDate: Date | undefined;
};
