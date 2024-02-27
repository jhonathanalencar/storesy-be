import { User } from '../../domain/entity/User';

export interface UserRepository {
  getById(userId: string): Promise<User | undefined>;
}
