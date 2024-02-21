import crypto from 'node:crypto';

export class Category {
  constructor(
    readonly categoryId: string,
    readonly name: string,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}

  static create(name: string) {
    const categoryId = crypto.randomUUID();
    const currentDate = new Date();
    return new Category(categoryId, name, currentDate, currentDate);
  }

  static restore(categoryId: string, name: string, createdAt: Date, updatedAt: Date) {
    return new Category(categoryId, name, createdAt, updatedAt);
  }
}
