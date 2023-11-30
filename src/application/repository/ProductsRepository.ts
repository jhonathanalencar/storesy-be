import { Product } from '../../domain/Product';

export interface ProductsRepository {
  getByCategory(category: string): Promise<Product[]>;
}
