import { Product } from '../../domain/entity/Product';
import { ProductsRepository } from '../repository/ProductsRepository';

export class UpdateProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<void> {
    const product = await this.productsRepository.getById(input.productId);
    const updatedProduct = Product.restore(
      input.productId,
      input.name,
      product.slug,
      input.description,
      input.summary,
      input.price,
      product.categories,
      input.imageUrl,
      input.quantity,
      product.createdAt,
      product.updatedAt,
      input.discountId,
      product.getReleasedDate()
    );
    await this.productsRepository.update(updatedProduct);
  }
}

export type Input = {
  productId: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  categories: string[];
  imageUrl: string;
  quantity: number;
  discountId?: string;
};
