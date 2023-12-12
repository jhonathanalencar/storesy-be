export interface HttpServer {
  on(method: string, url: string, callback: Function): void;
  use(handlers: any): void;
  listen(port: number): void;
}
