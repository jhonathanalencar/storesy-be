import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import path from 'node:path';

import { HttpServer } from './HttpServer';
import { RouterFactory } from './RouterFactory';

export class ExpressAdapter implements HttpServer {
  app: express.Application;

  constructor(private readonly routerFactory: RouterFactory) {
    this.app = express();
    this.app.use(express.json());
    this.app.use('/api', this.routerFactory.register());
    this.app.use('/', express.static(path.resolve(__dirname, '../../..', 'public')));
    this.app.get('^/$|/index(.html)?', (request, response) => {
      response.sendFile(
        path.resolve(__dirname, '../../..', 'public/assets', 'views', 'index.html')
      );
    });
    this.app.all('*', (request, response) => {
      response.status(404);
      if (request.accepts('html')) {
        response.sendFile(
          path.resolve(__dirname, '../../..', 'public/assets', 'views', 'notFound.html')
        );
      } else if (request.accepts('json')) {
        response.json({ message: '404 Not Found' });
      } else {
        response.type('txt').send('404 Not Found');
      }
    });
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method as keyof express.Application](
      url,
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const output = await callback(request.params, request.body, request.headers, next);
        response.json(output);
      }
    );
  }

  use(handlers: any): void {
    this.app.use(handlers);
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  }
}
