import { Request, Response, NextFunction } from 'express';
import { HttpServer } from '../../infra/http/HttpServer';
import { isHttpError } from 'http-errors';

export class ErrorHandler {
  constructor(readonly httpServer: HttpServer) {
    this.httpServer.use(
      (
        error: Error & { status?: number },
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        console.error(error.stack);

        let errorMessage = error.message
          ? error.message
          : 'An unknown error occurred';
        let statusCode = error.status ? error.status : 500;

        if (isHttpError(error)) {
          errorMessage = error.message;
          statusCode = error.status;
        }

        res.status(statusCode).json({ message: errorMessage, isError: true });
      }
    );
  }
}
