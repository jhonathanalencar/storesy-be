import crypto from 'node:crypto';

import { Rate } from './Rate';

export class Product {
  ratings: Rate[];

  constructor(
    readonly product_id: string,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly summary: string,
    readonly price: number,
    readonly categories: string[],
    readonly image_url: string,
    readonly is_deal: boolean,
    readonly discount_percent: number,
    readonly quantity_available: number,
    readonly created_at: Date,
    readonly updated_at: Date,
    private released_date?: Date
  ) {}

  release() {
    this.released_date = new Date();
  }

  getReleasedDate() {
    return this.released_date;
  }

  static create(
    name: string,
    description: string,
    price: number,
    categories: string[],
    image_url: string
  ) {
    const product_id = crypto.randomUUID();
    const slug = name.toLowerCase().split(' ').join('-');
    const summary =
      description.length < 100
        ? description
        : `${description.substring(0, 100)}...`;
    const currentDate = new Date();
    return new Product(
      product_id,
      name,
      slug,
      description,
      summary,
      price,
      categories,
      image_url,
      false,
      0,
      0,
      currentDate,
      currentDate
    );
  }
}
