import crypto from 'node:crypto';

import { Rate } from './Rate';

export class Discount {
  constructor(
    readonly discountId: string,
    readonly discountPercent: number,
    readonly active: boolean
  ) {}

  static create(discountId: string, discountPercent: number, active: boolean) {
    return new Discount(discountId, discountPercent, active);
  }
}

export class Product {
  ratings: Rate[];
  discount: Discount | null;

  constructor(
    readonly productId: string,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly summary: string,
    readonly price: number,
    readonly categories: string[],
    readonly imageUrl: string,
    readonly quantity: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly discountId?: string,
    private releasedDate?: Date
  ) {}

  release() {
    this.releasedDate = new Date();
  }

  getReleasedDate() {
    return this.releasedDate;
  }

  static create(
    name: string,
    description: string,
    price: number,
    categories: string[],
    imageUrl: string,
    quantity: number,
    discountId?: string
  ) {
    const productId = crypto.randomUUID();
    const slug = name.toLowerCase().split(' ').join('-');
    const summary = description.length < 100 ? description : `${description.substring(0, 100)}...`;
    const currentDate = new Date();
    return new Product(
      productId,
      name,
      slug,
      description,
      summary,
      price,
      categories,
      imageUrl,
      quantity,
      currentDate,
      currentDate,
      discountId
    );
  }

  static restore(
    productId: string,
    name: string,
    slug: string,
    description: string,
    summary: string,
    price: number,
    categories: string[],
    imageUrl: string,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    discountId?: string,
    releasedDate?: Date
  ) {
    return new Product(
      productId,
      name,
      slug,
      description,
      summary,
      price,
      categories,
      imageUrl,
      quantity,
      createdAt,
      updatedAt,
      discountId,
      releasedDate
    );
  }
}
