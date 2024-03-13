import { CustomError } from './CustomError';

export class UnauthenticatedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}
