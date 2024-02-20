import type { Request, Response, NextFunction } from 'express';
import { isHttpError } from 'http-errors';
import { ZodError } from 'zod';

import { HttpServer } from '../../infra/http/HttpServer';

export class ErrorHandler {
  constructor(readonly httpServer: HttpServer) {
    this.httpServer.use(
      (error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
        console.error(error.stack);
        let errorMessage = error.message ? error.message : 'An unknown error occurred';
        let statusCode = error.status ? error.status : 500;
        if (isHttpError(error)) {
          errorMessage = error.message;
          statusCode = error.status;
        }
        if (error instanceof ZodError) {
          errorMessage = error.errors[0].message;
          statusCode = 400;
        }
        res.status(statusCode).json({ message: errorMessage, isError: true });
      }
    );
  }
}
