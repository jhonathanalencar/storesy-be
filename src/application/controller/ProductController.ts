export interface ProductController {
  create(request: any, response: any): Promise<void>;
  getById(request: any, response: any): Promise<void>;
  getByCategory(request: any, response: any): Promise<void>;
  getBySlug(request: any, response: any): Promise<void>;
  list(request: any, response: any): Promise<void>;
  update(request: any, response: any): Promise<void>;
  release(request: any, response: any): Promise<void>;
}
