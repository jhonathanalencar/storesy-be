import { Product } from '../../src/domain/Product';

describe('Product Entity', () => {
  test('Should be able to create a product', () => {
    const product = Product.create(
      'Product Name',
      'Product Description',
      9600,
      ['technology'],
      'https://product.image.com'
    );
    expect(product.product_id).toBeDefined();
    expect(product.name).toBe('Product Name');
    expect(product.slug).toBe('product-name');
    expect(product.description).toBe('Product Description');
    expect(product.summary).toBeDefined();
    expect(product.categories).toEqual(['technology']);
    expect(product.image_url).toBe('https://product.image.com');
    expect(product.price).toBe(9600);
    expect(product.is_deal).toBe(false);
    expect(product.discount_percent).toBe(0);
    expect(product.created_at).toBeDefined();
    expect(product.updated_at).toBeDefined();
    expect(product.getReleasedDate()).toBeUndefined();
  });

  test('Should be able to release a product', () => {
    const product = Product.create(
      'Product Name',
      'Product Description',
      9600,
      ['technology'],
      'https://product.image.com'
    );
    product.release();
    expect(product.getReleasedDate()).toBeDefined();
    expect(product.getReleasedDate()).toBeInstanceOf(Date);
  });
});
