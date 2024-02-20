import type { Request, Response } from 'express';

import { ListAllProducts } from '../../application/usecase/ListAllProducts';
import { AddProduct } from '../../application/usecase/AddProduct';
import { GetProduct } from '../../application/usecase/GetProduct';
import { GetProductsByCategory } from '../../application/usecase/GetProductsByCategory';
import { ReleaseProduct } from '../../application/usecase/ReleaseProduct';
import { UpdateProduct } from '../../application/usecase/UpdateProduct';
import { ProductController } from '../../application/controller/ProductController';

export class ProductControllerHttp implements ProductController {
  constructor(
    private readonly getProductsByCategory: GetProductsByCategory,
    private readonly getProduct: GetProduct,
    private readonly addProduct: AddProduct,
    private readonly releaseProduct: ReleaseProduct,
    private readonly listAllProducts: ListAllProducts,
    private readonly updateProduct: UpdateProduct
  ) {}

  async create(request: Request, response: Response): Promise<void> {
    const body = request.body;
    const output = await this.addProduct.execute(body);
    response.status(201).json(output);
  }

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const output = await this.getProduct.execute(id);
    response.status(200).json(output);
  }

  async getByCategory(request: Request, response: Response): Promise<void> {
    const { category } = request.params;
    const output = await this.getProductsByCategory.execute(category);
    response.status(200).json(output);
  }

  async list(request: Request, response: Response): Promise<void> {
    const products = await this.listAllProducts.execute();
    response.status(200).json(products);
  }

  async update(request: Request, response: Response): Promise<void> {
    const body = request.body;
    const { id } = request.params;
    await this.updateProduct.execute({ ...body, productId: id });
    response.status(204).send();
  }

  async release(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    await this.releaseProduct.execute(id);
    response.status(204).send();
  }
}
