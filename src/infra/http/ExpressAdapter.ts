import express from 'express';

import { HttpServer } from './HttpServer';

export class ExpressAdapter implements HttpServer {
  app: express.Express;

  constructor() {
    this.app = express();
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method as keyof express.Application](
      url,
      async (request: express.Request, response: express.Response) => {
        const output = await callback(
          request.params,
          request.body,
          request.headers
        );
        response.json(output);
      }
    );
  }

  listen(port: number): void {
    this.app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  }
}
