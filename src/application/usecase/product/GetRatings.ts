import { z } from 'zod';

import { ProductsRepository } from '../../repository/ProductsRepository';

export class GetRatings {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const [total, ratingsData] = await Promise.all([
      this.productsRepository.countRatings(input.productId),
      this.productsRepository.getRatings(input.productId, input.limit, input.offset),
    ]);
    const ratings = ratingsData.map((rating) => {
      return {
        rateId: rating.rateId,
        userId: rating.userId,
        score: rating.rate,
        description: rating.content,
        postedAt: rating.postedAt,
        editedAt: rating.editedAt,
      };
    });
    return {
      total,
      ratings,
    };
  }
}

export type Input = {
  productId: string;
  limit: number;
  offset: number;
};

export type Output = {
  total: number;
  ratings: {
    rateId: string;
    userId: string;
    score: number;
    description: string;
    editedAt: Date;
    postedAt: Date;
  }[];
};

export const getRatingsParams = z.object({
  productId: z
    .string({ required_error: 'productId is required' })
    .uuid('productId is not a valid uuid'),
});

export const getRatingsQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
