import { AddProduct } from './application/usecase/AddProduct';
import { GetProduct } from './application/usecase/GetProduct';
import { GetProductsByCategory } from './application/usecase/GetProductsByCategory';
import { ReleaseProduct } from './application/usecase/ReleaseProduct';
import { ExpressAdapter } from './infra/http/ExpressAdapter';
import { ErrorHandler } from './application/errors/ErrorHandler';
import { LoadEnv } from './infra/helpers/LoadEnv';
import { ProductsRepositoryDatabase } from './infra/repository/ProductsRepositoryDatabase';
import { PgPromiseAdapter } from './infra/database/PgPromiseAdapter';
import { ListAllProducts } from './application/usecase/ListAllProducts';
import { UpdateProduct } from './application/usecase/UpdateProduct';
import { ProductController } from './infra/controller/ProductController';

LoadEnv.load();
const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const productsRepository = new ProductsRepositoryDatabase(connection);
const getProductsByCategory = new GetProductsByCategory(productsRepository);
const listAllProducts = new ListAllProducts(productsRepository);
const getProduct = new GetProduct(productsRepository);
const addProduct = new AddProduct(productsRepository);
const releaseProduct = new ReleaseProduct(productsRepository);
const updateProduct = new UpdateProduct(productsRepository);

new ProductController(
  httpServer,
  getProductsByCategory,
  getProduct,
  addProduct,
  releaseProduct,
  listAllProducts,
  updateProduct
);
httpServer.notFound();
new ErrorHandler(httpServer);
httpServer.listen(3333);
