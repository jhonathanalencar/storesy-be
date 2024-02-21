import { CategoryRepository } from '../../repository/CategoryRepository';

export class ListAllCategories {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Output> {
    const categories = await this.categoryRepository.listAll();
    return categories.map((category) => {
      return {
        categoryId: category.categoryId,
        name: category.name,
        slug: category.slug,
      };
    });
  }
}

export type Output = {
  categoryId: string;
  name: string;
  slug: string;
}[];
