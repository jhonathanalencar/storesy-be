import { Router } from 'express';

import { ProductController } from '../../application/controller/ProductController';
import { CategoryController } from '../../application/controller/CategoryController';

export class RouterFactory {
  constructor(
    private readonly productController: ProductController,
    private readonly categoryController: CategoryController
  ) {}

  register() {
    const router = Router();
    router.get('/category', (request, response) => {
      return this.categoryController.list(request, response);
    });
    router.post('/category', (request, response) => {
      return this.categoryController.create(request, response);
    });
    router.get('/category/:categoryId', (request, response) => {
      return this.categoryController.getById(request, response);
    });
    router.put('/category/:categoryId', (request, response) => {
      return this.categoryController.update(request, response);
    });

    router.get('/products', (request, response) => {
      return this.productController.list(request, response);
    });
    router.post('/products', (request, response) => {
      return this.productController.create(request, response);
    });
    router.get('/products/:productId', (request, response) => {
      return this.productController.getById(request, response);
    });
    router.put('/products/:productId', (request, response) => {
      return this.productController.update(request, response);
    });
    router.post('/products/:productId/release', (request, response) => {
      return this.productController.release(request, response);
    });
    router.get('/products/category/:category', (request, response) => {
      return this.productController.getByCategory(request, response);
    });
    router.get('/products/slug/:slug', (request, response) => {
      return this.productController.getBySlug(request, response);
    });
    return router;
  }
}
