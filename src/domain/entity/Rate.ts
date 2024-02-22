export class Rate {
  constructor(
    readonly rateId: string,
    readonly userId: string,
    // readonly username: string,
    // readonly profile_image_url: string,
    readonly rate: number,
    readonly content: string,
    readonly postedAt: Date,
    readonly editedAt: Date
  ) {}

  static create(
    userId: string,
    username: string,
    profile_image_url: string,
    rate: number,
    content: string
  ) {
    const rate_id = crypto.randomUUID();
    const currentDate = new Date();
    return new Rate(rate_id, userId, rate, content, currentDate, currentDate);
  }
}
