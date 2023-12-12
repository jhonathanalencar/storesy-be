import express from 'express';

import { HttpServer } from './HttpServer';

export class ExpressAdapter implements HttpServer {
  app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.get('', (params, aaa, bbb) => {});
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method as keyof express.Application](
      url,
      async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        const output = await callback(
          request.params,
          request.body,
          request.headers,
          next
        );
        response.json(output);
      }
    );
  }

  use(handlers: any): void {
    this.app.use(handlers);
  }

  listen(port: number): void {
    this.app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  }
}
