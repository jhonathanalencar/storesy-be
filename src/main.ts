import { AddProduct } from './application/usecase/product/AddProduct';
import { GetProduct } from './application/usecase/product/GetProduct';
import { GetProductsByCategory } from './application/usecase/product/GetProductsByCategory';
import { ReleaseProduct } from './application/usecase/product/ReleaseProduct';
import { ExpressAdapter } from './infra/http/ExpressAdapter';
import { ErrorHandler } from './application/errors/ErrorHandler';
import { LoadEnv } from './infra/helpers/LoadEnv';
import { ProductsRepositoryDatabase } from './infra/repository/ProductsRepositoryDatabase';
import { PgPromiseAdapter } from './infra/database/PgPromiseAdapter';
import { ListAllProducts } from './application/usecase/product/ListAllProducts';
import { UpdateProduct } from './application/usecase/product/UpdateProduct';
import { ProductControllerHttp } from './infra/controller/ProductControllerHttp';
import { RouterFactory } from './infra/http/RouterFactory';
import { CategoryControllerHttp } from './infra/controller/CategoryControllerHttp';
import { CategoryRepositoryDatabase } from './infra/repository/CategoryRepositoryDatabase';
import { ListAllCategories } from './application/usecase/category/ListAllCategories';

LoadEnv.load();
const connection = new PgPromiseAdapter();
const productsRepository = new ProductsRepositoryDatabase(connection);
const getProductsByCategory = new GetProductsByCategory(productsRepository);
const listAllProducts = new ListAllProducts(productsRepository);
const getProduct = new GetProduct(productsRepository);
const addProduct = new AddProduct(productsRepository);
const releaseProduct = new ReleaseProduct(productsRepository);
const updateProduct = new UpdateProduct(productsRepository);
const productController = new ProductControllerHttp(
  getProductsByCategory,
  getProduct,
  addProduct,
  releaseProduct,
  listAllProducts,
  updateProduct
);
const categoryRepository = new CategoryRepositoryDatabase(connection);
const listAllCategories = new ListAllCategories(categoryRepository);
const categoryController = new CategoryControllerHttp(listAllCategories);
const routerFactory = new RouterFactory(productController, categoryController);
const httpServer = new ExpressAdapter(routerFactory);
new ErrorHandler(httpServer);
httpServer.listen(3333);
