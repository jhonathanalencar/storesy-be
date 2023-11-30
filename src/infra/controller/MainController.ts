import { ListProductsByCategory } from '../../application/usecase/ListProductsByCategory';
import { HttpServer } from '../http/HttpServer';

export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    readonly listProductsByCategory: ListProductsByCategory
  ) {
    this.httpServer.on(
      'get',
      '/products/:category',
      async function (
        params: { category: string },
        body: unknown,
        headers: unknown
      ) {
        const output = await listProductsByCategory.execute(params.category);
        return output;
      }
    );
  }
}
