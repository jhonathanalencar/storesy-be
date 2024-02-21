import type { Request, Response } from 'express';

import { CategoryController } from '../../application/controller/CategoryController';
import { ListAllCategories } from '../../application/usecase/category/ListAllCategories';

export class CategoryControllerHttp implements CategoryController {
  constructor(private readonly listAllCategories: ListAllCategories) {}

  create(request: Request, response: Response): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getById(request: Request, response: Response): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async list(request: Request, response: Response): Promise<void> {
    const categories = await this.listAllCategories.execute();
    response.status(200).json(categories);
  }

  update(request: Request, response: Response): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
