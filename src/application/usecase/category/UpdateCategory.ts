import { NotFoundError } from '../../errors/NotFound';
import { CategoryRepository } from '../../repository/CategoryRepository';

export class UpdateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input) {
    const category = await this.categoryRepository.getById(input.categoryId);
    if (!category) throw new NotFoundError('category not found');
    await this.categoryRepository.update(category);
  }
}

export type Input = {
  categoryId: string;
  name: string;
};
