import crypto from 'node:crypto';

export class Rate {
  constructor(
    readonly rateId: string,
    readonly userId: string,
    readonly rate: number,
    readonly content: string,
    readonly postedAt: Date,
    readonly editedAt: Date
  ) {}

  static create(userId: string, rate: number, content: string) {
    const rate_id = crypto.randomUUID();
    const currentDate = new Date();
    return new Rate(rate_id, userId, rate, content, currentDate, currentDate);
  }

  static restore(
    rateId: string,
    userId: string,
    rate: number,
    content: string,
    postedAt: Date,
    editedAt: Date
  ) {
    return new Rate(rateId, userId, rate, content, postedAt, editedAt);
  }
}
