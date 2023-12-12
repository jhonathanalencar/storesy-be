import { AddProduct } from './application/usecase/AddProduct';
import { GetProduct } from './application/usecase/GetProduct';
import { GetProductsByCategory } from './application/usecase/GetProductsByCategory';
import { ReleaseProduct } from './application/usecase/ReleaseProduct';
import { MainController } from './infra/controller/MainController';
import { ExpressAdapter } from './infra/http/ExpressAdapter';
import { ProductsRepositoryMemory } from './infra/repository/ProductsRepositoryMemory';
import { ErrorHandler } from './application/errors/ErrorHandler';

const httpServer = new ExpressAdapter();
const productsRepository = new ProductsRepositoryMemory();
const getProductsByCategory = new GetProductsByCategory(productsRepository);
const getProduct = new GetProduct(productsRepository);
const addProduct = new AddProduct(productsRepository);
const releaseProduct = new ReleaseProduct(productsRepository);
new MainController(
  httpServer,
  getProductsByCategory,
  getProduct,
  addProduct,
  releaseProduct
);
new ErrorHandler(httpServer);
httpServer.listen(3333);
