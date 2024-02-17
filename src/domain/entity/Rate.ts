export class Rate {
  constructor(
    readonly rate_id: string,
    readonly user_id: string,
    readonly username: string,
    readonly profile_image_url: string,
    readonly rate: number,
    readonly content: string,
    readonly posted_at: Date,
    readonly edited_at: Date
  ) {}

  static create(
    user_id: string,
    username: string,
    profile_image_url: string,
    rate: number,
    content: string
  ) {
    const rate_id = crypto.randomUUID();
    const currentDate = new Date();
    return new Rate(
      rate_id,
      user_id,
      username,
      profile_image_url,
      rate,
      content,
      currentDate,
      currentDate
    );
  }
}
