import { ProductsRepository } from '../../application/repository/ProductsRepository';
import { Discount, Product } from '../../domain/entity/Product';
import { ProductModel } from '../../domain/model/ProductModel';
import { Connection } from '../database/Connection';
import { formatProductData } from '../helpers/formatProductData';

export type ProductData = ProductModel & {
  category_name: string;
  category_id: string;
  discount_percent: number;
  active: boolean;
  product_rate_id: string;
  user_id: string;
  score: number;
  product_rate_description: string;
  product_rate_created_at: Date;
  product_rate_updated_at: Date;
  rate_amount: string;
  total_score: string;
};

export type DiscountModel = {
  discount_id: string;
  discount_percent: number;
  active: boolean;
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

  async getByCategory(category: string, limit: number, offset: number): Promise<Product[]> {
    const productsData: ProductData[] = await this.connection.query(
      'select p.*, c.name as category_name, c.category_id, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p inner join lak.category c on c.slug = $1 inner join lak.product_category pc on pc.category_id = c.category_id left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where pc.product_id = p.product_id and pc.category_id = c.category_id group by p.slug, p.name, p.description, p.summary, p.image_url, p.price, p.created_at, p.updated_at, p.released_date, p.product_id, c.name, c.category_id, d.discount_percent, d.active limit $2 offset $3',
      [category, limit, offset]
    );
    const products = productsData.map((productData) => {
      const product = Product.restore(
        productData.product_id,
        productData.name,
        productData.slug,
        productData.description,
        productData.summary,
        parseFloat(productData.price),
        [productData.category_name],
        productData.image_url,
        parseInt(productData.quantity),
        productData.created_at,
        productData.updated_at,
        productData.discount_id,
        productData.released_date
      );
      if (product.discountId) {
        product.discount = Discount.create(
          productData.discount_id,
          productData.discount_percent,
          productData.active
        );
      }
      product.rate_amount = parseInt(productData.rate_amount);
      product.total_score = parseInt(productData.total_score);
      return product;
    });
    return products;
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
    const productsData: ProductData[] = await this.connection.query(
      'select p.*, c.name as category_name, c.category_id, d.discount_percent, d.active, pr.product_rate_id, pr.score, pr.user_id, pr.created_at as product_rate_created_at, pr.updated_at as product_rate_updated_at, pr.description as product_rate_description from lak.product p inner join lak.product_category pc on pc.product_id = p.product_id inner join lak.category c on pc.category_id = c.category_id left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where p.slug = $1',
      [slug]
    );
    if (productsData.length === 0) return;
    const productData = formatProductData(productsData);
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
    product.ratings = productData.ratings.map((rate) => {
      return {
        content: rate.product_rate_description,
        rate: rate.score,
        rateId: rate.product_rate_id,
        postedAt: rate.posted_at,
        editedAt: rate.edited_at,
        userId: rate.user_id,
      };
    });
    if (product.discountId) {
      product.discount = Discount.create(
        productData.discount_id,
        productData.discount_percent,
        productData.active
      );
    }
    return product;
  }

  async getById(id: string): Promise<Product | undefined> {
    const productWithCategoryData: ProductData[] = await this.connection.query(
      'select p.*, c.name as category_name, c.category_id from lak.product p inner join lak.product_category pc on pc.product_id = p.product_id inner join lak.category c on pc.category_id = c.category_id inner join lak.discount d on d.discount_id = p.discount_id inner join lak.product_rate pr on pr.product_id = p.product_id where p.product_id = $1',
      [id]
    );
    if (productWithCategoryData.length === 0) return;
    const productData = formatProductData(productWithCategoryData);
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
    const [productsData, categoriesData]: [ProductModel[], { name: string; product_id: string }[]] =
      await Promise.all([
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

  async listDeals(limit: number, offset: number): Promise<Product[]> {
    const productsData: (ProductModel &
      DiscountModel & { rate_amount: string; total_score: string })[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p inner join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where d.active = true group by p.slug, p.name, p.description, p.summary, p.image_url, p.price, p.created_at, p.updated_at, p.released_date, p.product_id, d.discount_percent, d.active limit $1 offset $2',
      [limit, offset]
    );
    const products = productsData.map((productData) => {
      const product = Product.restore(
        productData.product_id,
        productData.name,
        productData.slug,
        productData.description,
        productData.summary,
        parseFloat(productData.price),
        [],
        productData.image_url,
        parseInt(productData.quantity),
        productData.created_at,
        productData.updated_at,
        productData.discount_id,
        productData.released_date
      );
      if (product.discountId) {
        product.discount = Discount.create(
          productData.discount_id,
          productData.discount_percent,
          productData.active
        );
      }
      product.rate_amount = parseInt(productData.rate_amount);
      product.total_score = parseInt(productData.total_score);
      return product;
    });
    return products;
  }

  async listMostRecent(limit: number, offset: number): Promise<Product[]> {
    const productsData: (ProductModel &
      DiscountModel & { rate_amount: string; total_score: string })[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id group by p.slug, p.name, p.description, p.summary, p.image_url, p.price, p.created_at, p.updated_at, p.released_date, p.product_id, d.discount_percent, d.active order by released_date desc limit $1 offset $2',
      [limit, offset]
    );
    const products = productsData.map((productData) => {
      const product = Product.restore(
        productData.product_id,
        productData.name,
        productData.slug,
        productData.description,
        productData.summary,
        parseFloat(productData.price),
        [],
        productData.image_url,
        parseInt(productData.quantity),
        productData.created_at,
        productData.updated_at,
        productData.discount_id,
        productData.released_date
      );
      if (product.discountId) {
        product.discount = Discount.create(
          productData.discount_id,
          productData.discount_percent,
          productData.active
        );
      }
      product.rate_amount = parseInt(productData.rate_amount);
      product.total_score = parseInt(productData.total_score);
      return product;
    });
    return products;
  }

  async listBestSellers(productIds: string, limit: number): Promise<Product[]> {
    const productsData: (ProductModel &
      DiscountModel & { rate_amount: string; total_score: string })[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id inner join lak.product_rate pr on pr.product_id = p.product_id where p.product_id = any ($1) group by p.slug, p.name, p.description, p.summary, p.image_url, p.price, p.created_at, p.updated_at, p.released_date, p.product_id, d.discount_percent, d.active limit $2',
      [`{${productIds}}`, limit]
    );
    const products = productsData.map((productData) => {
      const product = Product.restore(
        productData.product_id,
        productData.name,
        productData.slug,
        productData.description,
        productData.summary,
        parseFloat(productData.price),
        [],
        productData.image_url,
        parseInt(productData.quantity),
        productData.created_at,
        productData.updated_at,
        productData.discount_id,
        productData.released_date
      );
      if (product.discountId) {
        product.discount = Discount.create(
          productData.discount_id,
          productData.discount_percent,
          productData.active
        );
      }
      product.rate_amount = parseInt(productData.rate_amount);
      product.total_score = parseInt(productData.total_score);
      return product;
    });
    return products;
  }

  async search(query: string, limit: number, offset: number): Promise<Product[]> {
    const productsData: (ProductModel &
      DiscountModel & { rate_amount: string; total_score: string })[] = await this.connection.query(
      'select p.*, d.discount_percent, d.active, count(pr.product_rate_id) as rate_amount, sum(pr.score) as total_score from lak.product p left join lak.discount d on d.discount_id = p.discount_id left join lak.product_rate pr on pr.product_id = p.product_id where lower(p.name) like $1 or lower(p.description) like $1 group by p.slug, p.name, p.description, p.summary, p.image_url, p.price, p.created_at, p.updated_at, p.released_date, p.product_id, d.discount_percent, d.active order by p.product_id limit $2 offset $3',
      [`%${query}%`, limit, offset]
    );
    const products = productsData.map((productData) => {
      const product = Product.restore(
        productData.product_id,
        productData.name,
        productData.slug,
        productData.description,
        productData.summary,
        parseFloat(productData.price),
        [],
        productData.image_url,
        parseInt(productData.quantity),
        productData.created_at,
        productData.updated_at,
        productData.discount_id,
        productData.released_date
      );
      if (product.discountId) {
        product.discount = Discount.create(
          productData.discount_id,
          productData.discount_percent,
          productData.active
        );
      }
      product.rate_amount = parseInt(productData.rate_amount);
      product.total_score = parseInt(productData.total_score);
      return product;
    });
    return products;
  }

  async count(): Promise<number> {
    const [count]: { total: string }[] = await this.connection.query(
      'select count(*) as total from lak.product',
      []
    );
    return parseInt(count.total);
  }

  async countSearch(query: string): Promise<number> {
    const [count]: { total: string }[] = await this.connection.query(
      'select count(*) as total from lak.product p where lower(p.name) like $1 or lower(p.description) like $1',
      [`%${query}%`]
    );
    return parseInt(count.total);
  }

  async countCategory(category: string): Promise<number> {
    const [count]: { total: string }[] = await this.connection.query(
      'select count(*) as total from lak.product p inner join lak.category c on c.slug = $1 inner join lak.product_category pc on pc.product_id = p.product_id and pc.category_id = c.category_id',
      [category]
    );
    return parseInt(count.total);
  }

  async countDeals(): Promise<number> {
    const [count]: { total: string }[] = await this.connection.query(
      'select count(*) as total from lak.product p inner join lak.discount d on d.discount_id = p.discount_id where d.active = true',
      []
    );
    return parseInt(count.total);
  }

  async countBestSellers(): Promise<number> {
    const [count]: { total: string }[] = await this.connection.query(
      'select count(distinct p.product_id) as total from lak.product p inner join lak.product_rate pr on pr.product_id = p.product_id',
      []
    );
    return parseInt(count.total);
  }
}
