import { ProductsRepository } from '../../src/application/repository/ProductsRepository';
import { GetProduct } from '../../src/application/usecase/GetProduct';
import { ListProductsByCategory } from '../../src/application/usecase/ListProductsByCategory';
import { ReleaseProduct } from '../../src/application/usecase/ReleaseProduct';
import { ProductsRepositoryMemory } from '../../src/infra/repository/ProductsRepositoryMemory';

describe('List Products By Category UseCase', () => {
  let listProductsByCategory: ListProductsByCategory;
  let productsRepository: ProductsRepository;

  beforeEach(() => {
    productsRepository = new ProductsRepositoryMemory();
    listProductsByCategory = new ListProductsByCategory(productsRepository);
  });

  test('Should list products by category', async () => {
    const products = await listProductsByCategory.execute('Headphones');
    expect(products[0]).toHaveProperty(
      'categories',
      expect.arrayContaining(['Headphones'])
    );
  });

  test("Shouldn't be able to list unreleased products", async () => {
    const products = await listProductsByCategory.execute('Headphones');
    const getProduct = new GetProduct(productsRepository);
    let product = await getProduct.execute(products[0].productId);
    expect(product.releaseDate).not.toBeDefined();
    const releaseProduct = new ReleaseProduct(productsRepository);
    await releaseProduct.execute(product.productId);
    product = await getProduct.execute(products[0].productId);
    expect(product.releaseDate).toBeDefined();
    expect(product.releaseDate).toBeInstanceOf(Date);
  });
});
