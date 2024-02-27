export interface UserController {
  getById(request: any, response: any): Promise<void>;
}
