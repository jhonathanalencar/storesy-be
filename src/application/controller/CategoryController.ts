export interface CategoryController {
  create(request: any, response: any): Promise<void>;
  getById(request: any, response: any): Promise<void>;
  list(request: any, response: any): Promise<void>;
  update(request: any, response: any): Promise<void>;
}
