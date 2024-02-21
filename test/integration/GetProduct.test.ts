import { ProductsRepository } from '../../src/application/repository/ProductsRepository';
import { GetProduct } from '../../src/application/usecase/product/GetProduct';
import { ProductsRepositoryMemory } from '../../src/infra/repository/ProductsRepositoryMemory';

describe('Get Product UseCase', () => {
  let getProduct: GetProduct;
  let productsRepository: ProductsRepository;

  beforeEach(() => {
    productsRepository = new ProductsRepositoryMemory();
    getProduct = new GetProduct(productsRepository);
  });

  test('Should be able to get product', async () => {
    const products = await productsRepository.getByCategory('headphones');
    const productData = products[0];
    const outputProduct = await getProduct.execute(productData.productId);
    expect(outputProduct.productId).toBeDefined();
    expect(outputProduct.name).toBe(productData.name);
    expect(outputProduct.description).toBe(productData.description);
    expect(outputProduct.price).toBe(productData.price);
    expect(outputProduct.categories).toBe(productData.categories);
    expect(outputProduct.imageUrl).toBe(productData.imageUrl);
  });

  test("Shouldn't be able to get a non existing product", async () => {
    expect(getProduct.execute('faker')).rejects.toThrow(new Error('Product not found!'));
  });
});
