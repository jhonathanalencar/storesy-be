import { z } from 'zod';

import { Category } from '../../../domain/entity/Category';
import { CategoryRepository } from '../../repository/CategoryRepository';

export class CreateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = Category.create(input.name, input.department);
    await this.categoryRepository.save(category);
    return { categoryId: category.categoryId };
  }
}

export type Input = {
  name: string;
  department: string;
};

export type Output = {
  categoryId: string;
};

export const createCategoryBody = z.object({
  name: z.string({ required_error: 'name is required' }).trim().min(1, 'name is required'),
  department: z
    .string({ required_error: 'department is required' })
    .trim()
    .min(1, 'department is required'),
});
