import { GetProductsByCategory } from '../../application/usecase/GetProductsByCategory';
import { HttpServer } from '../http/HttpServer';

export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getProductsByCategory: GetProductsByCategory
  ) {
    this.httpServer.on(
      'get',
      '/products/:category',
      async function (
        params: { category: string },
        body: unknown,
        headers: unknown
      ) {
        const output = await getProductsByCategory.execute(params.category);
        return output;
      }
    );
  }
}
