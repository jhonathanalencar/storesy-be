import { AddProduct, Input } from '../../src/application/usecase/product/AddProduct';
import { ProductsRepositoryMemory } from '../../src/infra/repository/ProductsRepositoryMemory';

test('Should be able to add a product', async () => {
  const productsRepository = new ProductsRepositoryMemory();
  const addProduct = new AddProduct(productsRepository);
  const inputAddProduct: Input = {
    name: 'RevitalizeMist Facial Toner',
    description:
      "Indulge your skin in the refreshing embrace of RevitalizeMist Facial Toner. This revitalizing mist is a hydrating and invigorating blend of botanical extracts designed to tone, soothe, and replenish your skin. With a delicate fragrance and a burst of moisture, it's the perfect pick-me-up for your skin throughout the day. Elevate your skincare routine with the RevitalizeMist Facial Toner and experience a rejuvenating burst of freshness for radiant, dewy skin.",
    price: 2499,
    categories: ['Cosmetics', 'Beauty'],
    imageUrl:
      'https://images.unsplash.com/photo-1626897844971-aef92643f056?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quantity: 10,
  };
  const outputAddProduct = await addProduct.execute(inputAddProduct);
  const foundProduct = await productsRepository.getById(outputAddProduct.productId);
  expect(foundProduct.name).toEqual(inputAddProduct.name);
  expect(foundProduct.description).toEqual(inputAddProduct.description);
  expect(foundProduct.price).toEqual(inputAddProduct.price);
  expect(foundProduct.categories).toEqual(inputAddProduct.categories);
  expect(foundProduct.imageUrl).toEqual(inputAddProduct.imageUrl);
  expect(foundProduct.quantity).toEqual(inputAddProduct.quantity);
});
