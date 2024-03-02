import { ProductsRepository } from '../../application/repository/ProductsRepository';
import { Product } from '../../domain/entity/Product';
import { Rate } from '../../domain/entity/Rate';
import type { CategoryModel } from '../../domain/model/CategoryModel';
import type { DiscountModel } from '../../domain/model/DiscountModel';
import type { ProductModel } from '../../domain/model/ProductModel';
import type { RateModel } from '../../domain/model/RateModel';
import { Connection } from '../database/Connection';
import { formatProductData } from '../helpers/formatProductData';

type RatingAggregations = {
  rate_amount: string;
  total_score: string;
};

type Count = { total: string };

export type ProductData = ProductModel & DiscountModel & RatingAggregations;

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

  async getByCategory(category: string, limit: number, offset: number): Promise<Product[]> {
    const [productsData, [categoryData]]: [ProductData[], CategoryModel[]] = await Promise.all([
      this.connection.query(
        'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p inner join lak.category c on c.slug = $1 inner join lak.product_category pc on pc.category_id = c.category_id left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where pc.product_id = p.product_id and pc.category_id = c.category_id group by p.product_id, d.discount_id limit $2 offset $3',
        [category, limit, offset]
      ),
      this.connection.query('select * from lak.category where slug = $1', [category]),
    ]);
    const products = productsData.map((productData) => {
      const product = formatProductData(productData);
      product.categories.push(categoryData.name);
      return product;
    });
    return products;
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
    const [productData]: ProductData[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where p.slug = $1 group by p.product_id, d.discount_id',
      [slug]
    );
    if (!productData) return;
    const product = formatProductData(productData);
    return product;
  }

  async getById(id: string): Promise<Product | undefined> {
    const [productData]: ProductData[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where p.product_id = $1 group by p.product_id, d.discount_id',
      [id]
    );
    if (!productData) return;
    const product = formatProductData(productData);
    return product;
  }

  async getRatings(slug: string, limit: number, offset: number): Promise<Product['ratings']> {
    const ratingsData: RateModel[] = await this.connection.query(
      'select pr.* from lak.product_rate pr inner join lak.product p on p.product_id = pr.product_id where p.slug = $1 limit $2 offset $3',
      [slug, limit, offset]
    );
    const ratings = ratingsData.map((rating) => {
      return Rate.restore(
        rating.product_rate_id,
        rating.user_id,
        rating.score,
        rating.description,
        new Date(rating.created_at),
        new Date(rating.updated_at)
      );
    });
    return ratings;
  }

  async getCategories(productId: string): Promise<string[]> {
    const categoriesData: CategoryModel[] = await this.connection.query(
      'select c.* from lak.category c inner join lak.product_category pc on pc.category_id = c.category_id where pc.product_id = $1',
      [productId]
    );
    return categoriesData.map((category) => category.name);
  }

  async listAll(): Promise<Product[]> {
    const [productsData, categoriesData]: [ProductData[], { name: string; product_id: string }[]] =
      await Promise.all([
        this.connection.query(
          'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id group by p.product_id, d.discount_id',
          []
        ),
        this.connection.query(
          'select distinct pc.product_id, c.category_id, c.name from lak.product_category pc inner join lak.category c on c.category_id = pc.category_id',
          []
        ),
      ]);
    const products = productsData.map((productData) => {
      const product = formatProductData(productData);
      const categories = categoriesData.reduce((acc, category) => {
        if (category.product_id === product.productId) {
          acc.push(category.name);
        }
        return acc;
      }, [] as string[]);
      product.categories.push(...categories);
      return product;
    });
    return products;
  }

  async listDeals(limit: number, offset: number): Promise<Product[]> {
    const productsData: ProductData[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p inner join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where d.active = true group by p.product_id, d.discount_id limit $1 offset $2',
      [limit, offset]
    );
    const products = productsData.map((productData) => {
      const product = formatProductData(productData);
      return product;
    });
    return products;
  }

  async listMostRecent(limit: number, offset: number): Promise<Product[]> {
    const productsData: ProductData[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id group by p.product_id, d.discount_id order by released_date desc limit $1 offset $2',
      [limit, offset]
    );
    const products = productsData.map((productData) => {
      const product = formatProductData(productData);
      return product;
    });
    return products;
  }

  async listBestSellers(productIds: string, limit: number): Promise<Product[]> {
    const productsData: ProductData[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id inner join lak.product_rate pr on pr.product_id = p.product_id where p.product_id = any ($1) group by p.product_id, d.discount_id limit $2',
      [`{${productIds}}`, limit]
    );
    const products = productsData.map((productData) => {
      const product = formatProductData(productData);
      return product;
    });
    return products;
  }

  async search(query: string, limit: number, offset: number): Promise<Product[]> {
    const productsData: ProductData[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where lower(p.name) like $1 or lower(p.description) like $1 group by p.product_id, d.discount_id order by p.product_id limit $2 offset $3',
      [`%${query}%`, limit, offset]
    );
    const products = productsData.map((productData) => {
      const product = formatProductData(productData);
      return product;
    });
    return products;
  }

  async count(): Promise<number> {
    const [count]: Count[] = await this.connection.query(
      'select count(*) as total from lak.product',
      []
    );
    return parseInt(count.total);
  }

  async countSearch(query: string): Promise<number> {
    const [count]: Count[] = await this.connection.query(
      'select count(*) as total from lak.product p where lower(p.name) like $1 or lower(p.description) like $1',
      [`%${query}%`]
    );
    return parseInt(count.total);
  }

  async countCategory(category: string): Promise<number> {
    const [count]: Count[] = await this.connection.query(
      'select count(*) as total from lak.product p inner join lak.category c on c.slug = $1 inner join lak.product_category pc on pc.product_id = p.product_id and pc.category_id = c.category_id',
      [category]
    );
    return parseInt(count.total);
  }

  async countDeals(): Promise<number> {
    const [count]: Count[] = await this.connection.query(
      'select count(*) as total from lak.product p inner join lak.discount d on d.discount_id = p.discount_id where d.active = true',
      []
    );
    return parseInt(count.total);
  }

  async countBestSellers(): Promise<number> {
    const [count]: Count[] = await this.connection.query(
      'select count(distinct p.product_id) as total from lak.product p inner join lak.product_rate pr on pr.product_id = p.product_id',
      []
    );
    return parseInt(count.total);
  }

  async countRatings(slug: string): Promise<number> {
    const [count]: Count[] = await this.connection.query(
      'select count(*) as total from lak.product_rate pr inner join lak.product p on p.product_id = pr.product_id where p.slug = $1',
      [slug]
    );
    return parseInt(count.total);
  }
}
