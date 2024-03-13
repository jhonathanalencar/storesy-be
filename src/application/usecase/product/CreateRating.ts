import { z } from 'zod';

import { Rate } from '../../../domain/entity/Rate';
import { ProductsRepository } from '../../repository/ProductsRepository';
import { SortedSet } from '../../../infra/cache/SortedSet';

export class CreateRating {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly sortedSet: SortedSet
  ) {}

  async execute(input: Input) {
    const rating = Rate.create(input.userId, input.score, input.description);
    await Promise.all([
      this.productsRepository.createRating(input.productId, rating),
      this.sortedSet.increment('products', rating.rate, input.productId),
    ]);
    return { rateId: rating.rateId };
  }
}

export type Input = {
  productId: string;
  userId: string;
  score: number;
  description: string;
};

export type Output = {
  rateId: string;
};

export const createRatingParams = z.object({
  productId: z
    .string({ required_error: 'productId is required' })
    .uuid('productId is not a valid uuid'),
});

export const createRatingHeaders = z.object({
  authorization: z
    .string({ required_error: 'userId is required' })
    .trim()
    .min(1, 'userId is required'),
});

export const createRatingBody = z.object({
  score: z.number({ required_error: 'score is required' }).int().positive(),
  description: z
    .string({ required_error: 'description is required' })
    .trim()
    .min(1, 'description is required'),
});
