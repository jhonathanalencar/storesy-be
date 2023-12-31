import {
  AddProduct,
  Input as AddProductInput,
} from '../../application/usecase/AddProduct';
import { GetProduct } from '../../application/usecase/GetProduct';
import { GetProductsByCategory } from '../../application/usecase/GetProductsByCategory';
import { ReleaseProduct } from '../../application/usecase/ReleaseProduct';
import { HttpServer } from '../http/HttpServer';

export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getProductsByCategory: GetProductsByCategory,
    readonly getProduct: GetProduct,
    readonly addProduct: AddProduct,
    readonly releaseProduct: ReleaseProduct
  ) {
    this.httpServer.on(
      'get',
      '/:category',
      async (
        params: { category: string },
        body: unknown,
        headers: unknown,
        next: Function
      ) => {
        try {
          const output = await this.getProductsByCategory.execute(
            params.category
          );
          return output;
        } catch (error) {
          next(error);
        }
      }
    );
    this.httpServer.on(
      'get',
      '/products/:id',
      async (
        params: { id: string },
        body: unknown,
        headers: unknown,
        next: Function
      ) => {
        try {
          const output = await this.getProduct.execute(params.id);
          return output;
        } catch (error) {
          next(error);
        }
      }
    );
    this.httpServer.on(
      'post',
      '/products',
      async (
        params: unknown,
        body: AddProductInput,
        headers: unknown,
        next: Function
      ) => {
        try {
          const output = await this.addProduct.execute(body);
          return output;
        } catch (error) {
          next(error);
        }
      }
    );
    this.httpServer.on(
      'post',
      '/products/:id',
      async (
        params: { id: string },
        body: unknown,
        headers: unknown,
        next: Function
      ) => {
        try {
          await this.releaseProduct.execute(params.id);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
