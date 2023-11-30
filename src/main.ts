import { AddProduct } from './application/usecase/AddProduct';
import { GetProduct } from './application/usecase/GetProduct';
import { GetProductsByCategory } from './application/usecase/GetProductsByCategory';
import { ReleaseProduct } from './application/usecase/ReleaseProduct';
import { MainController } from './infra/controller/MainController';
import { ExpressAdapter } from './infra/http/ExpressAdapter';
import { ProductsRepositoryMemory } from './infra/repository/ProductsRepositoryMemory';

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
httpServer.listen(3333);
