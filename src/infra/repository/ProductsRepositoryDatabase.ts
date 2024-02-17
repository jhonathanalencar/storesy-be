import { ProductsRepository } from '../../application/repository/ProductsRepository';
import { Product } from '../../domain/entity/Product';
import { ProductModel } from '../../domain/model/ProductModel';
import { Connection } from '../database/Connection';

type productsWithCategory = ProductModel & {
  category_name: string;
  category_id: string;
};

export class ProductsRepositoryDatabase implements ProductsRepository {
  constructor(private readonly connection: Connection) {}

  async save(product: Product): Promise<void> {
    await this.connection.query(
      'insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [
        product.productId,
        product.name,
        product.slug,
        product.description,
        product.summary,
        product.price,
        product.imageUrl,
        product.discountId,
        product.quantity,
        product.createdAt,
        product.updatedAt,
        product.getReleasedDate(),
      ]
    );
    await Promise.all([
      ...product.categories.map((category) => {
        return this.connection.query(
          'insert into lak.product_category (product_id, category_id) values ($1, $2)',
          [product.productId, category]
        );
      }),
    ]);
  }

  async update(product: Product): Promise<void> {
    await this.connection.query(
      'update lak.product set (name, slug, description, summary, price, image_url, discount_id, quantity, released_date) = ($1, $2, $3, $4, $5, $6, $7, $8, $9) where product_id = $10',
      [
        product.name,
        product.slug,
        product.description,
        product.summary,
        product.price,
        product.imageUrl,
        product.discountId,
        product.quantity,
        product.getReleasedDate(),
        product.productId,
      ]
    );
  }

  async getByCategory(category: string): Promise<Product[]> {
    const productsWithCategoryData: productsWithCategory[] =
      await this.connection.query(
        'select p.*, c.name as category_name, c.category_id from lak.product p inner join lak.category c on c.name = $1',
        [category]
      );
    const products = productsWithCategoryData.map((productWithCategory) => {
      return Product.restore(
        productWithCategory.product_id,
        productWithCategory.name,
        productWithCategory.slug,
        productWithCategory.description,
        productWithCategory.summary,
        parseFloat(productWithCategory.price),
        [productWithCategory.category_name],
        productWithCategory.image_url,
        parseInt(productWithCategory.quantity),
        productWithCategory.created_at,
        productWithCategory.updated_at,
        productWithCategory.discount_id,
        productWithCategory.released_date
      );
    });
    return products;
  }

  async getById(id: string): Promise<Product> {
    const productWithCategoryData: productsWithCategory[] =
      await this.connection.query(
        'select p.*, c.name as category_name, c.category_id from lak.product p inner join lak.product_category pc on pc.product_id = p.product_id inner join lak.category c on pc.category_id = c.category_id where p.product_id = $1',
        [id]
      );
    const productData = productWithCategoryData.reduce(
      (acc, product) => {
        if (Object.keys(acc).length === 0) {
          Object.assign(acc, product);
          Reflect.deleteProperty(acc, 'category_name');
          Reflect.deleteProperty(acc, 'category_id');
          acc.categories = [product.category_name];
        }
        if (!acc.categories.includes(product.category_name)) {
          acc.categories.push(product.category_name);
        }
        return acc;
      },
      {} as ProductModel & { categories: string[] }
    );
    const product = Product.restore(
      productData.product_id,
      productData.name,
      productData.slug,
      productData.description,
      productData.summary,
      parseFloat(productData.price),
      productData.categories,
      productData.image_url,
      parseInt(productData.quantity),
      productData.created_at,
      productData.updated_at,
      productData.discount_id,
      productData.released_date
    );
    return product;
  }

  async listAll(): Promise<Product[]> {
    const [productsData, categoriesData]: [
      ProductModel[],
      { name: string; product_id: string }[],
    ] = await Promise.all([
      this.connection.query('select * from lak.product', []),
      this.connection.query(
        'select distinct pc.product_id, c.category_id, c.name from lak.product_category pc inner join lak.category c on c.category_id = pc.category_id',
        []
      ),
    ]);
    const products = productsData.map((product) => {
      return Product.restore(
        product.product_id,
        product.name,
        product.slug,
        product.description,
        product.summary,
        parseFloat(product.price),
        categoriesData.reduce((acc, category) => {
          if (category.product_id === product.product_id) {
            acc.push(category.name);
          }
          return acc;
        }, [] as string[]),
        product.image_url,
        parseInt(product.quantity),
        product.created_at,
        product.updated_at,
        product.discount_id,
        product.released_date
      );
    });
    return products;
  }
}
