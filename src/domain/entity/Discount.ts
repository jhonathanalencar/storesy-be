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
