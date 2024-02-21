import { Category } from '../../../domain/entity/Category';
import { CategoryRepository } from '../../repository/CategoryRepository';

export class CreateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = Category.create(input.name);
    await this.categoryRepository.save(category);
    return { categoryId: category.categoryId };
  }
}

export type Input = {
  name: string;
};

export type Output = {
  categoryId: string;
};
