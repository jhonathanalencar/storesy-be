import crypto from 'node:crypto';

export class Category {
  constructor(
    readonly categoryId: string,
    readonly name: string,
    readonly slug: string,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}

  static create(name: string) {
    const categoryId = crypto.randomUUID();
    const slug = name.toLowerCase().split(' ').join('-');
    const currentDate = new Date();
    return new Category(categoryId, name, slug, currentDate, currentDate);
  }

  static restore(categoryId: string, name: string, slug: string, createdAt: Date, updatedAt: Date) {
    return new Category(categoryId, name, slug, createdAt, updatedAt);
  }
}
