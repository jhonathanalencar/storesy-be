import { NotFoundError } from '../../errors/NotFound';
import { CategoryRepository } from '../../repository/CategoryRepository';

export class GetCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.categoryRepository.getById(input.categoryId);
    if (!category) throw new NotFoundError('Category not found');
    return {
      categoryId: category.categoryId,
      name: category.name,
      slug: category.slug,
    };
  }
}

export type Input = {
  categoryId: string;
};

export type Output = {
  categoryId: string;
  name: string;
  slug: string;
};
