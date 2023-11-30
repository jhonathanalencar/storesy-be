import crypto from 'node:crypto';

export class Product {
  constructor(
    readonly productId: string,
    readonly name: string,
    readonly description: string,
    readonly summary: string,
    readonly price: number,
    readonly categories: string[],
    readonly imageUrl: string,
    private releaseDate?: Date
  ) {}

  release() {
    this.releaseDate = new Date();
  }

  getReleaseDate() {
    return this.releaseDate;
  }

  static create(
    name: string,
    description: string,
    price: number,
    categories: string[],
    imageUrl: string
  ) {
    const productId = crypto.randomUUID();
    const summary =
      description.length < 100
        ? description
        : `${description.substring(0, 100)}...`;
    return new Product(
      productId,
      name,
      description,
      summary,
      price,
      categories,
      imageUrl
    );
  }
}
