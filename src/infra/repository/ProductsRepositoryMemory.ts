import { ProductsRepository } from '../../application/repository/ProductsRepository';
import { Product } from '../../domain/Product';

export class ProductsRepositoryMemory implements ProductsRepository {
  private products: Product[];

  constructor() {
    this.products = [
      Product.create(
        'HarmonyPod Wireless Earbuds',
        'Immerse yourself in unparalleled audio bliss with HarmonyPod Wireless Earbuds. These sleek and compact earbuds deliver crystal-clear sound and deep bass, providing an immersive listening experience. With touch controls, a secure fit, and long-lasting battery life, HarmonyPod is the perfect companion for music lovers on the go. Elevate your auditory journey and embrace the harmony of superior sound quality with HarmonyPod Wireless Earbuds.',
        6999,
        ['technology', 'headphones'],
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ),
      Product.create(
        'EcoFresh Bamboo Toothbrush Set',
        'Make your daily routine eco-friendly with the EcoFresh Bamboo Toothbrush Set. Crafted from sustainably sourced bamboo, these toothbrushes offer a stylish and environmentally conscious alternative to traditional plastic brushes. The set includes four brushes with charcoal-infused bristles for a refreshing clean. Upgrade your oral care routine while contributing to a greener planet with the EcoFresh Bamboo Toothbrush Set.',
        1499,
        ['sustainability', 'toothbrush', 'oral care'],
        'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ),
      Product.create(
        'GloFit Smart Fitness Tracker',
        'Revolutionize your fitness journey with the GloFit Smart Fitness Tracker. Packed with advanced features, this sleek wearable is your personal health companion. Track your steps, monitor heart rate, analyze sleep patterns, and receive real-time notifications seamlessly. With a vibrant touch display and water-resistant design, the GloFit ensures you stay connected and motivated throughout your day. Elevate your fitness experience and embrace a healthier, more informed lifestyle with the GloFit Smart Fitness Tracker.',
        7999,
        ['technology', 'fitness', 'digital watch'],
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ),
    ];
  }

  async save(product: Product): Promise<void> {
    return new Promise((resolve) => {
      this.products.push(product);
      resolve();
    });
  }

  async update(product: Product): Promise<void> {
    const newProducts = this.products.map((productData) => {
      if (productData.productId === product.productId) {
        return product;
      }
      return productData;
    });
    return new Promise((resolve) => {
      this.products = newProducts;
      resolve();
    });
  }

  async getByCategory(category: string): Promise<Product[]> {
    const filteredProducts = this.products.filter((product) =>
      product.categories.includes(category)
    );
    return new Promise((resolve) => {
      resolve(filteredProducts);
    });
  }

  async getById(id: string): Promise<Product> {
    const foundProduct = this.products.find(
      (product) => product.productId === id
    );
    if (!foundProduct) throw new Error('Product not found!');
    const product = new Product(
      foundProduct.productId,
      foundProduct.name,
      foundProduct.description,
      foundProduct.summary,
      foundProduct.price,
      foundProduct.categories,
      foundProduct.imageUrl,
      foundProduct.getReleaseDate()
    );
    return new Promise((resolve) => {
      resolve(product);
    });
  }
}
