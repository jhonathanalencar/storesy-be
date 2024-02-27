import type { Request, Response } from 'express';

import { UserController } from '../../application/controller/UserController';
import { GetUserById, getUserByIdParams } from '../../application/usecase/user/GetUserById';

export class UserControllerHttp implements UserController {
  constructor(private readonly getUserById: GetUserById) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { userId } = getUserByIdParams.parse(request.params);
    const output = await this.getUserById.execute({ userId });
    response.status(200).json(output);
  }
}
