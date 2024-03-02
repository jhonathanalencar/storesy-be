import { ProductsRepository } from '../../repository/ProductsRepository';
export class ListAllProducts {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(): Promise<Output> {
    const products = await this.productsRepository.listAll();
    return products.map((product) => {
      return {
        productId: product.productId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        categories: product.categories,
        imageUrl: product.imageUrl,
        quantity: product.quantity,
        releasedDate: product.getReleasedDate(),
        discountPercent: product.discount?.discountPercent ?? 0,
        active: product.discount?.active ?? false,
        rateAmount: product.rateAmount,
        totalScore: product.totalScore,
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
  discountPercent: number;
  active: boolean;
  rateAmount: number;
  totalScore: number;
}[];
