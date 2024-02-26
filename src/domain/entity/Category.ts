import crypto from 'node:crypto';

export class Category {
  constructor(
    readonly categoryId: string,
    readonly name: string,
    readonly slug: string,
    readonly department: string,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}

  static create(name: string, department: string) {
    const categoryId = crypto.randomUUID();
    const slug = name.toLowerCase().split(' ').join('-');
    const currentDate = new Date();
    return new Category(categoryId, name, slug, department, currentDate, currentDate);
  }

  static restore(
    categoryId: string,
    name: string,
    slug: string,
    department: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    return new Category(categoryId, name, slug, department, createdAt, updatedAt);
  }
}
