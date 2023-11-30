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
    expect(product.productId).toBeDefined();
    expect(product.name).toBe('Product Name');
    expect(product.description).toBe('Product Description');
    expect(product.summary).toBeDefined();
    expect(product.categories).toEqual(['technology']);
    expect(product.imageUrl).toBe('https://product.image.com');
    expect(product.price).toBe(9600);
    expect(product.getReleaseDate()).toBeUndefined();
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
    expect(product.getReleaseDate()).toBeDefined();
    expect(product.getReleaseDate()).toBeInstanceOf(Date);
  });
});
