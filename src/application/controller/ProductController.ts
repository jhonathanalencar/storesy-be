export interface ProductController {
  create(request: any, response: any): Promise<void>;
  createRating(request: any, response: any): Promise<void>;
  getById(request: any, response: any): Promise<void>;
  getByCategory(request: any, response: any): Promise<void>;
  getBySlug(request: any, response: any): Promise<void>;
  getProductRatings(request: any, response: any): Promise<void>;
  list(request: any, response: any): Promise<void>;
  listDeals(request: any, response: any): Promise<void>;
  listMostRecent(request: any, response: any): Promise<void>;
  listBestSellers(request: any, response: any): Promise<void>;
  update(request: any, response: any): Promise<void>;
  updateQuantity(request: any, response: any): Promise<void>;
  release(request: any, response: any): Promise<void>;
  search(request: any, response: any): Promise<void>;
}
