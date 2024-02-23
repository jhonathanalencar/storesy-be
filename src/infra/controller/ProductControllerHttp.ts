import type { Request, Response } from 'express';

import { ListAllProducts } from '../../application/usecase/product/ListAllProducts';
import { AddProduct, createProductBody } from '../../application/usecase/product/AddProduct';
import { GetProduct, getProductParams } from '../../application/usecase/product/GetProduct';
import {
  GetProductsByCategory,
  getProductsByCategoryParams,
} from '../../application/usecase/product/GetProductsByCategory';
import {
  ReleaseProduct,
  releaseProductParams,
} from '../../application/usecase/product/ReleaseProduct';
import {
  UpdateProduct,
  updateProductBody,
  updateProductParams,
} from '../../application/usecase/product/UpdateProduct';
import { ProductController } from '../../application/controller/ProductController';
import { GetProductsBySlug } from '../../application/usecase/product/GetProductsBySlug';
import { ListDeals } from '../../application/usecase/product/ListDeals';
import { ListMostRecent } from '../../application/usecase/product/ListMostRecent';
import { ListBestSellers } from '../../application/usecase/product/ListBestSellers';

export class ProductControllerHttp implements ProductController {
  constructor(
    private readonly getProductsByCategory: GetProductsByCategory,
    private readonly getProduct: GetProduct,
    private readonly addProduct: AddProduct,
    private readonly releaseProduct: ReleaseProduct,
    private readonly listAllProducts: ListAllProducts,
    private readonly updateProduct: UpdateProduct,
    private readonly getProductBySlug: GetProductsBySlug,
    private readonly listProductDeals: ListDeals,
    private readonly listRecent: ListMostRecent,
    private readonly listBestSellersProducts: ListBestSellers
  ) {}

  async create(request: Request, response: Response): Promise<void> {
    const body = createProductBody.parse(request.body);
    const output = await this.addProduct.execute(body);
    response.status(201).json(output);
  }

  async getById(request: Request, response: Response): Promise<void> {
    const { productId } = getProductParams.parse(request.params);
    const output = await this.getProduct.execute(productId);
    response.status(200).json(output);
  }

  async getByCategory(request: Request, response: Response): Promise<void> {
    const { category } = getProductsByCategoryParams.parse(request.params);
    const output = await this.getProductsByCategory.execute(category);
    response.status(200).json(output);
  }

  async getBySlug(request: Request, response: Response): Promise<void> {
    const { slug } = request.params;
    const output = await this.getProductBySlug.execute(slug);
    response.status(200).json(output);
  }

  async list(request: Request, response: Response): Promise<void> {
    const output = await this.listAllProducts.execute();
    response.status(200).json(output);
  }

  async listMostRecent(request: Request, response: Response): Promise<void> {
    const output = await this.listRecent.execute();
    response.status(200).json(output);
  }

  async listBestSellers(request: Request, response: Response): Promise<void> {
    const { productIds } = request.query;
    const output = await this.listBestSellersProducts.execute({
      productIds: productIds as string,
    });
    response.status(200).json(output);
  }

  async listDeals(request: Request, response: Response): Promise<void> {
    const output = await this.listProductDeals.execute();
    response.status(200).json(output);
  }

  async update(request: Request, response: Response): Promise<void> {
    const { productId } = updateProductParams.parse(request.params);
    const body = updateProductBody.parse(request.body);
    await this.updateProduct.execute({ ...body, productId });
    response.status(204).send();
  }

  async release(request: Request, response: Response): Promise<void> {
    const { productId } = releaseProductParams.parse(request.params);
    await this.releaseProduct.execute(productId);
    response.status(204).send();
  }
}
