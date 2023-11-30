import { ProductsRepository } from '../repository/ProductsRepository';

export class ReleaseProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(productId: string): Promise<void> {
    const product = await this.productsRepository.getById(productId);
    product.release();
    await this.productsRepository.update(product);
  }
}
