import { Product } from '../../domain/Product';

export interface ProductsRepository {
  update(product: Product): Promise<void>;
  getByCategory(category: string): Promise<Product[]>;
  getById(id: string): Promise<Product>;
}
