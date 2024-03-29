import type { Request, Response } from 'express';

import { ListAllProducts } from '../../application/usecase/product/ListAllProducts';
import { AddProduct, createProductBody } from '../../application/usecase/product/AddProduct';
import { GetProduct, getProductParams } from '../../application/usecase/product/GetProduct';
import {
  GetProductsByCategory,
  getProductsByCategoryParams,
  getProductsByCategoryQuery,
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
import {
  GetProductsBySlug,
  getProductsBySlugParams,
} from '../../application/usecase/product/GetProductsBySlug';
import { ListDeals, listDealsQuery } from '../../application/usecase/product/ListDeals';
import {
  ListMostRecent,
  listMostRecentQuery,
} from '../../application/usecase/product/ListMostRecent';
import {
  ListBestSellers,
  listBestSellersQuery,
} from '../../application/usecase/product/ListBestSellers';
import {
  SearchProducts,
  searchProductsQuery,
} from '../../application/usecase/product/searchProducts';
import {
  GetRatings,
  getRatingsParams,
  getRatingsQuery,
} from '../../application/usecase/product/GetRatings';
import {
  UpdateProductQuantity,
  updateProductQuantityBody,
  updateProductQuantityParams,
} from '../../application/usecase/product/UpdateQuantity';
import {
  CreateRating,
  createRatingBody,
  createRatingHeaders,
  createRatingParams,
} from '../../application/usecase/product/CreateRating';
import { UnauthenticatedError } from '../../application/errors/Unauthenticated';

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
    private readonly listBestSellersProducts: ListBestSellers,
    private readonly searchProducts: SearchProducts,
    private readonly getRatings: GetRatings,
    private readonly updateProductQuantity: UpdateProductQuantity,
    private readonly createProductRating: CreateRating
  ) {}

  async create(request: Request, response: Response): Promise<void> {
    const body = createProductBody.parse(request.body);
    const output = await this.addProduct.execute(body);
    response.status(201).json(output);
  }

  async createRating(request: Request, response: Response): Promise<void> {
    const { authorization } = createRatingHeaders.parse(request.headers);
    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthenticatedError('Unauthorized');
    }
    const userId = authorization.split(' ')?.[1];
    if (!userId) throw new UnauthenticatedError('Unauthorized');
    const { productId } = createRatingParams.parse(request.params);
    const body = createRatingBody.parse(request.body);
    const output = await this.createProductRating.execute({
      productId,
      userId,
      description: body.description,
      score: body.score,
    });
    response.status(201).json(output);
  }

  async getById(request: Request, response: Response): Promise<void> {
    const { productId } = getProductParams.parse(request.params);
    const output = await this.getProduct.execute(productId);
    response.status(200).json(output);
  }

  async getByCategory(request: Request, response: Response): Promise<void> {
    const { category } = getProductsByCategoryParams.parse(request.params);
    const { page = '1', limit = '10' } = getProductsByCategoryQuery.parse(request.query);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const output = await this.getProductsByCategory.execute({
      category,
      limit: parseInt(limit),
      offset,
    });
    response.status(200).json(output);
  }

  async getBySlug(request: Request, response: Response): Promise<void> {
    const { slug } = getProductsBySlugParams.parse(request.params);
    const output = await this.getProductBySlug.execute(slug);
    response.status(200).json(output);
  }

  async getProductRatings(request: Request, response: Response): Promise<void> {
    const { slug } = getRatingsParams.parse(request.params);
    const { page = '1', limit = '10' } = getRatingsQuery.parse(request.query);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const output = await this.getRatings.execute({ slug, limit: parseInt(limit), offset });
    response.status(200).json(output);
  }

  async list(request: Request, response: Response): Promise<void> {
    const output = await this.listAllProducts.execute();
    response.status(200).json(output);
  }

  async listMostRecent(request: Request, response: Response): Promise<void> {
    const { page = '1', limit = '10' } = listMostRecentQuery.parse(request.query);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const output = await this.listRecent.execute({ limit: parseInt(limit), offset });
    response.status(200).json(output);
  }

  async listBestSellers(request: Request, response: Response): Promise<void> {
    const { page = '1', limit = '10' } = listBestSellersQuery.parse(request.query);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const output = await this.listBestSellersProducts.execute({
      limit: parseInt(limit),
      offset,
    });
    response.status(200).json(output);
  }

  async listDeals(request: Request, response: Response): Promise<void> {
    const { page = '1', limit = '10' } = listDealsQuery.parse(request.query);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const output = await this.listProductDeals.execute({ limit: parseInt(limit), offset });
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

  async search(request: Request, response: Response): Promise<void> {
    const { query, page = '1', limit = '10' } = searchProductsQuery.parse(request.query);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const output = await this.searchProducts.execute({ query, limit: parseInt(limit), offset });
    response.status(200).json(output);
  }

  async updateQuantity(request: Request, response: Response): Promise<void> {
    const { productId } = updateProductQuantityParams.parse(request.params);
    const body = updateProductQuantityBody.parse(request.body);
    await this.updateProductQuantity.execute({ productId, quantity: body.quantity });
    response.status(204).send();
  }
}
