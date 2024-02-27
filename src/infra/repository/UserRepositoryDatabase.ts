import { UserRepository } from '../../application/repository/UserRepository';
import { User } from '../../domain/entity/User';
import { UserModel } from '../../domain/model/UserModel';
import { Connection } from '../database/Connection';

export class UserRepositoryDatabase implements UserRepository {
  constructor(private readonly connection: Connection) {}

  async getById(userId: string): Promise<User | undefined> {
    const [userData]: UserModel[] = await this.connection.query(
      'select * from lak.user where user_id = $1',
      [userId]
    );
    if (!userData) return;
    const user = User.restore(userData.user_id, userData.name, userData.email, userData.image);
    return user;
  }
}
