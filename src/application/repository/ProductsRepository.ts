import { Product } from '../../domain/entity/Product';
import { Rate } from '../../domain/entity/Rate';

export interface ProductsRepository {
  save(product: Product): Promise<void>;
  createRating(productId: string, rate: Rate): Promise<void>;
  update(product: Product): Promise<void>;
  updateQuantity(product: Product): Promise<void>;
  getByCategory(category: string, limit: number, offset: number): Promise<Product[]>;
  getById(id: string): Promise<Product | undefined>;
  getBySlug(slug: string): Promise<Product | undefined>;
  getRatings(slug: string, limit: number, offset: number): Promise<Product['ratings']>;
  getCategories(id: string): Promise<Product['categories']>;
  listAll(): Promise<Product[]>;
  listDeals(limit: number, offset: number): Promise<Product[]>;
  listMostRecent(limit: number, offset: number): Promise<Product[]>;
  listBestSellers(ids: string, limit: number): Promise<Product[]>;
  search(query: string, limit: number, offset: number): Promise<Product[]>;
  count(): Promise<number>;
  countSearch(query: string): Promise<number>;
  countCategory(category: string): Promise<number>;
  countDeals(): Promise<number>;
  countBestSellers(): Promise<number>;
  countRatings(slug: string): Promise<number>;
}
