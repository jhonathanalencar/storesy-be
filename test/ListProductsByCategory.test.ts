import { ListProductsByCategory } from '../src/application/usecase/ListProductsByCategory';
import { ProductsRepositoryMemory } from '../src/infra/repository/ProductsRepositoryMemory';

describe('List Products By Category UseCase', () => {
  test('Should list products by category', async () => {
    const productsRepository = new ProductsRepositoryMemory();
    const listProductsByCategory = new ListProductsByCategory(
      productsRepository
    );
    const products = await listProductsByCategory.execute('Headphones');
    expect(products[0]).toHaveProperty(
      'categories',
      expect.arrayContaining(['Headphones'])
    );
  });
});
