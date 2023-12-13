import { Rate } from '../../src/domain/Rate';

describe('Rate Entity', () => {
  test('Should be able to create a rate', () => {
    const rate = Rate.create(
      'user-id',
      'Alice Garden',
      'https://user.image.com',
      4,
      'Good Stuff'
    );
    expect(rate.rate_id).toBeDefined();
    expect(rate.user_id).toBe('user-id');
    expect(rate.username).toBe('Alice Garden');
    expect(rate.rate).toBe(4);
    expect(rate.content).toBe('Good Stuff');
    expect(rate.profile_image_url).toBe('https://user.image.com');
    expect(rate.posted_at).toBeDefined();
    expect(rate.edited_at).toBeDefined();
  });
});
