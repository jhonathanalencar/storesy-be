import { CategoryRepository } from '../../application/repository/CategoryRepository';
import { Category } from '../../domain/entity/Category';
import { CategoryModel } from '../../domain/model/CategoryModel';
import { Connection } from '../database/Connection';

export class CategoryRepositoryDatabase implements CategoryRepository {
  constructor(private readonly connection: Connection) {}

  async save(category: Category): Promise<void> {
    await this.connection.query(
      'insert into lak.category (category_id, name, slug, created_at, updated_at) values ($1, $2, $3, $4, $5)',
      [category.categoryId, category.name, category.slug, category.createdAt, category.updatedAt]
    );
  }

  async update(category: Category): Promise<void> {
    await this.connection.query(
      'update lak.category set (name, slug, updated_at) = ($1, $2, $3)  where category_id = $4',
      [category.name, category.slug, category.updatedAt, category.categoryId]
    );
  }

  async getById(categoryId: string): Promise<Category | undefined> {
    const [categoryData]: CategoryModel[] = await this.connection.query(
      'select * from lak.category where category_id = $1',
      [categoryId]
    );
    if (!categoryData) return;
    const category = Category.restore(
      categoryData.category_id,
      categoryData.name,
      categoryData.slug,
      categoryData.created_at,
      categoryData.updated_at
    );
    return category;
  }

  async listAll(): Promise<Category[]> {
    const categoriesData: CategoryModel[] = await this.connection.query(
      'select * from lak.category',
      []
    );
    const categories = categoriesData.map((category) => {
      return Category.restore(
        category.category_id,
        category.name,
        category.slug,
        category.created_at,
        category.updated_at
      );
    });
    return categories;
  }
}
