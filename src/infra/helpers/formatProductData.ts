import { Discount } from '../../domain/entity/Discount';
import { Product } from '../../domain/entity/Product';
import type { ProductData } from '../repository/ProductsRepositoryDatabase';

export function formatProductData(productData: ProductData): Product {
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
    new Date(productData.created_at),
    new Date(productData.updated_at),
    productData.discount_id,
    new Date(productData.released_date)
  );
  if (product.discountId) {
    product.discount = Discount.create(
      productData.discount_id,
      productData.discount_percent,
      productData.active
    );
  }
  product.rateAmount = parseInt(productData.rate_amount ?? 0);
  product.totalScore = parseInt(productData.total_score ?? 0);
  return product;
}
