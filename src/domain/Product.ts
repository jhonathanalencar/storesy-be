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

  private release() {
    this.releaseDate = new Date();
  }

  static create(
    name: string,
    description: string,
    price: number,
    categories: string[],
    imageUrl: string
  ) {
    const productId = crypto.randomUUID();
    const summary = description.substring(0, 100);
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
