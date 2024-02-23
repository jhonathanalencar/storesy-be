import { ProductsRepository } from '../../repository/ProductsRepository';

export class ListDeals {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(): Promise<Output> {
    const products = await this.productsRepository.listDeals();
    return products.map((product) => {
      return {
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        quantity: product.quantity,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        categories: product.categories,
        releasedDate: product.getReleasedDate(),
      };
    });
  }
}

export type Output = {
  productId: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  imageUrl: string;
  quantity: number;
  releasedDate: Date | undefined;
}[];
