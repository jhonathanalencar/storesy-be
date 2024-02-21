import { Category } from '../../domain/entity/Category';

export interface CategoryRepository {
  save(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  getById(id: string): Promise<Category | undefined>;
  listAll(): Promise<Category[]>;
}
