import { Product } from '../../domain/Product';
import { ProductsRepository } from '../repository/ProductsRepository';

export class AddProduct {
  constructor(readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const newProduct = Product.create(
      input.name,
      input.description,
      input.price,
      input.categories,
      input.image_url
    );
    await this.productsRepository.save(newProduct);
    return { productId: newProduct.product_id };
  }
}

export type Input = {
  name: string;
  description: string;
  price: number;
  categories: string[];
  image_url: string;
};

export type Output = {
  productId: string;
};
