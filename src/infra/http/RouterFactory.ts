import { Router } from 'express';

import { ProductController } from '../../application/controller/ProductController';
import { CategoryController } from '../../application/controller/CategoryController';
import { UserController } from '../../application/controller/UserController';

export class RouterFactory {
  constructor(
    private readonly productController: ProductController,
    private readonly categoryController: CategoryController,
    private readonly userController: UserController
  ) {}

  register() {
    const router = Router();
    router.get('/user/:userId', (request, response) => {
      return this.userController.getById(request, response);
    });

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
    router.patch('/products/:productId/decrease', (request, response) => {
      return this.productController.updateQuantity(request, response);
    });
    router.post('/products/:productId/release', (request, response) => {
      return this.productController.release(request, response);
    });
    router.post('/products/:productId/rating', (request, response) => {
      return this.productController.createRating(request, response);
    });
    router.get('/category/:category/products', (request, response) => {
      return this.productController.getByCategory(request, response);
    });
    router.get('/slug/:slug/products', (request, response) => {
      return this.productController.getBySlug(request, response);
    });
    router.get('/slug/:slug/ratings', (request, response) => {
      return this.productController.getProductRatings(request, response);
    });
    router.get('/deals', (request, response) => {
      return this.productController.listDeals(request, response);
    });
    router.get('/new-arrivals', (request, response) => {
      return this.productController.listMostRecent(request, response);
    });
    router.get('/best-sellers', (request, response) => {
      return this.productController.listBestSellers(request, response);
    });
    router.get('/search', (request, response) => {
      return this.productController.search(request, response);
    });
    return router;
  }
}
