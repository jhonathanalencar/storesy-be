import { Product } from '../../src/domain/entity/Product';

describe('Product Entity', () => {
  test('Should be able to create a product', () => {
    const product = Product.create(
      'Product Name',
      'Product Description',
      96.0,
      ['technology'],
      'https://product.image.com',
      10
    );
    expect(product.productId).toBeDefined();
    expect(product.name).toBe('Product Name');
    expect(product.slug).toBe('product-name');
    expect(product.description).toBe('Product Description');
    expect(product.summary).toBeDefined();
    expect(product.categories).toEqual(['technology']);
    expect(product.imageUrl).toBe('https://product.image.com');
    expect(product.price).toBe(96.0);
    expect(product.discountId).toBeUndefined();
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
    expect(product.getReleasedDate()).toBeUndefined();
  });

  test('Should be able to release a product', () => {
    const product = Product.create(
      'Product Name',
      'Product Description',
      96.0,
      ['technology'],
      'https://product.image.com',
      10
    );
    product.release();
    expect(product.getReleasedDate()).toBeDefined();
    expect(product.getReleasedDate()).toBeInstanceOf(Date);
  });
});
