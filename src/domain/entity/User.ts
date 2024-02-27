import crypto from 'node:crypto';

export class User {
  constructor(
    readonly userId: string,
    readonly name: string,
    readonly email: string,
    readonly imageUrl: string
  ) {}

  static create(name: string, email: string, imageUrl: string) {
    const userId = crypto.randomUUID();
    return new User(userId, name, email, imageUrl);
  }

  static restore(userId: string, name: string, email: string, imageUrl: string) {
    return new User(userId, name, email, imageUrl);
  }
}
