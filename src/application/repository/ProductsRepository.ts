import { Product } from '../../domain/entity/Product';

export interface ProductsRepository {
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  getByCategory(category: string): Promise<Product[]>;
  getById(id: string): Promise<Product>;
  listAll(): Promise<Product[]>;
}
