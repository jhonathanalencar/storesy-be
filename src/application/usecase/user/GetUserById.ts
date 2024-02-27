import { z } from 'zod';
import { NotFoundError } from '../../errors/NotFound';
import { UserRepository } from '../../repository/UserRepository';

export class GetUserById {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getById(input.userId);
    if (!user) throw new NotFoundError('User not found');
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    };
  }
}

type Input = {
  userId: string;
};

type Output = {
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
};

export const getUserByIdParams = z.object({
  userId: z.string({ required_error: 'userId is required' }),
});
