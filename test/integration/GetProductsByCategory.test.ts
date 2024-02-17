import { ProductsRepository } from '../../src/application/repository/ProductsRepository';
import { GetProduct } from '../../src/application/usecase/GetProduct';
import { GetProductsByCategory } from '../../src/application/usecase/GetProductsByCategory';
import { ReleaseProduct } from '../../src/application/usecase/ReleaseProduct';
import { ProductsRepositoryMemory } from '../../src/infra/repository/ProductsRepositoryMemory';

describe('Get Products By Category UseCase', () => {
  let getProductsByCategory: GetProductsByCategory;
  let productsRepository: ProductsRepository;

  beforeEach(() => {
    productsRepository = new ProductsRepositoryMemory();
    getProductsByCategory = new GetProductsByCategory(productsRepository);
  });

  test('Should get products by category', async () => {
    const products = await getProductsByCategory.execute('Headphones');
    expect(products[0]).toHaveProperty(
      'categories',
      expect.arrayContaining(['headphones'])
    );
  });

  test("Shouldn't be able to get unreleased products", async () => {
    const products = await getProductsByCategory.execute('Headphones');
    const getProduct = new GetProduct(productsRepository);
    let product = await getProduct.execute(products[0].productId);
    expect(product.releasedDate).not.toBeDefined();
    const releaseProduct = new ReleaseProduct(productsRepository);
    await releaseProduct.execute(product.productId);
    product = await getProduct.execute(products[0].productId);
    expect(product.releasedDate).toBeDefined();
    expect(product.releasedDate).toBeInstanceOf(Date);
  });
});
