import type { Request, Response } from 'express';

import { CategoryController } from '../../application/controller/CategoryController';
import { ListAllCategories } from '../../application/usecase/category/ListAllCategories';
import {
  CreateCategory,
  createCategoryBody,
} from '../../application/usecase/category/CreateCategory';
import { GetCategory, getCategoryParams } from '../../application/usecase/category/GetCategory';
import {
  UpdateCategory,
  updateCategoryParams,
  updateCategoryBody,
} from '../../application/usecase/category/UpdateCategory';

export class CategoryControllerHttp implements CategoryController {
  constructor(
    private readonly createCategory: CreateCategory,
    private readonly getCategory: GetCategory,
    private readonly listAllCategories: ListAllCategories,
    private readonly updateCategory: UpdateCategory
  ) {}

  async create(request: Request, response: Response): Promise<void> {
    const { name } = createCategoryBody.parse(request.body);
    const output = await this.createCategory.execute({ name });
    response.status(201).json(output);
  }

  async getById(request: Request, response: Response): Promise<void> {
    const { categoryId } = getCategoryParams.parse(request.params);
    const output = await this.getCategory.execute({ categoryId });
    response.status(200).json(output);
  }

  async list(request: Request, response: Response): Promise<void> {
    const categories = await this.listAllCategories.execute();
    response.status(200).json(categories);
  }

  async update(request: Request, response: Response): Promise<void> {
    const { categoryId } = updateCategoryParams.parse(request.params);
    const { name } = updateCategoryBody.parse(request.body);
    await this.updateCategory.execute({ categoryId, name });
    response.status(204).send();
  }
}
