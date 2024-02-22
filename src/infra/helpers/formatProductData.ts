import { ProductModel } from '../../domain/model/ProductModel';
import { ProductData } from '../repository/ProductsRepositoryDatabase';

type ProductDataFormatted = ProductModel & {
  categories: string[];
  discount_percent: number;
  active: boolean;
  ratings: {
    product_rate_id: string;
    score: number;
    product_rate_description: string;
    user_id: string;
    posted_at: Date;
    edited_at: Date;
  }[];
};

export function formatProductData(productData: ProductData[]): ProductDataFormatted {
  const product = productData.reduce((acc, product) => {
    if (Object.keys(acc).length === 0) {
      Object.assign(acc, product);
      Reflect.deleteProperty(acc, 'category_name');
      Reflect.deleteProperty(acc, 'category_id');
      acc.categories = [product.category_name];
      acc.ratings = [];
    }
    if (!acc.categories.includes(product.category_name)) {
      acc.categories.push(product.category_name);
    }
    if (
      product.product_rate_id &&
      !acc.ratings.find((rate) => rate.product_rate_id === product.product_rate_id)
    ) {
      acc.ratings.push({
        product_rate_id: product.product_rate_id,
        score: product.score,
        product_rate_description: product.product_rate_description,
        edited_at: product.product_rate_updated_at,
        posted_at: product.product_rate_created_at,
        user_id: product.user_id,
      });
    }
    return acc;
  }, {} as ProductDataFormatted);
  return product;
}
