import { Router } from 'express';

import { ProductController } from '../../application/controller/ProductController';

export class RouterFactory {
  constructor(private readonly productController: ProductController) {}

  register() {
    const router = Router();
    router.get('/products/category/:category', (request, response) => {
      return this.productController.getByCategory(request, response);
    });
    router.get('/products/:id', (request, response) => {
      return this.productController.getById(request, response);
    });
    router.post('/products', (request, response) => {
      return this.productController.create(request, response);
    });
    router.post('/products/:id/release', (request, response) => {
      return this.productController.release(request, response);
    });
    router.put('/products/:id', (request, response) => {
      return this.productController.update(request, response);
    });
    router.get('/products', (request, response) => {
      return this.productController.list(request, response);
    });
    return router;
  }
}
