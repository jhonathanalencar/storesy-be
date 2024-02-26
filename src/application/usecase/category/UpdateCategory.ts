import { z } from 'zod';

import { Category } from '../../../domain/entity/Category';
import { NotFoundError } from '../../errors/NotFound';
import { CategoryRepository } from '../../repository/CategoryRepository';

export class UpdateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input) {
    const category = await this.categoryRepository.getById(input.categoryId);
    if (!category) throw new NotFoundError('category not found');
    const updatedCategory = Category.restore(
      category.categoryId,
      input.name,
      input.name.toLowerCase().split(' ').join('-'),
      input.department,
      category.createdAt,
      new Date()
    );
    await this.categoryRepository.update(updatedCategory);
  }
}

export type Input = {
  categoryId: string;
  name: string;
  department: string;
};

export const updateCategoryParams = z.object({
  categoryId: z
    .string({ required_error: 'categoryId is required' })
    .uuid('categoryId is not a valid uuid'),
});

export const updateCategoryBody = z.object({
  name: z.string({ required_error: 'name is required' }).trim().min(1, 'name is required'),
  department: z
    .string({ required_error: 'department is required' })
    .trim()
    .min(1, 'department is required'),
});
