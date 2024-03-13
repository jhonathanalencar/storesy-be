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
import { CreateCategory } from './application/usecase/category/CreateCategory';
import { GetCategory } from './application/usecase/category/GetCategory';
import { UpdateCategory } from './application/usecase/category/UpdateCategory';
import { GetProductsBySlug } from './application/usecase/product/GetProductsBySlug';
import { ListDeals } from './application/usecase/product/ListDeals';
import { ListMostRecent } from './application/usecase/product/ListMostRecent';
import { ListBestSellers } from './application/usecase/product/ListBestSellers';
import { RedisAdapter } from './infra/cache/RedisAdapter';
import { GetUserById } from './application/usecase/user/GetUserById';
import { UserRepositoryDatabase } from './infra/repository/UserRepositoryDatabase';
import { UserControllerHttp } from './infra/controller/UserControllerHttp';
import { SearchProducts } from './application/usecase/product/searchProducts';
import { GetRatings } from './application/usecase/product/GetRatings';
import { UpdateProductQuantity } from './application/usecase/product/UpdateQuantity';

LoadEnv.load();
const connection = new PgPromiseAdapter();
const productsRepository = new ProductsRepositoryDatabase(connection);
const redis = new RedisAdapter();
const getProductsByCategory = new GetProductsByCategory(productsRepository);
const listAllProducts = new ListAllProducts(productsRepository);
const getProduct = new GetProduct(productsRepository);
const addProduct = new AddProduct(productsRepository);
const releaseProduct = new ReleaseProduct(productsRepository);
const updateProduct = new UpdateProduct(productsRepository);
const getProductsBySlug = new GetProductsBySlug(productsRepository);
const listDeals = new ListDeals(productsRepository);
const listMostRecent = new ListMostRecent(productsRepository);
const listBestSellers = new ListBestSellers(productsRepository, redis);
const searchProducts = new SearchProducts(productsRepository);
const getRatings = new GetRatings(productsRepository);
const updateProductQuantity = new UpdateProductQuantity(productsRepository);
const productController = new ProductControllerHttp(
  getProductsByCategory,
  getProduct,
  addProduct,
  releaseProduct,
  listAllProducts,
  updateProduct,
  getProductsBySlug,
  listDeals,
  listMostRecent,
  listBestSellers,
  searchProducts,
  getRatings,
  updateProductQuantity
);
const categoryRepository = new CategoryRepositoryDatabase(connection);
const createCategory = new CreateCategory(categoryRepository);
const getCategory = new GetCategory(categoryRepository);
const listAllCategories = new ListAllCategories(categoryRepository);
const updateCategory = new UpdateCategory(categoryRepository);
const categoryController = new CategoryControllerHttp(
  createCategory,
  getCategory,
  listAllCategories,
  updateCategory
);
const userRepository = new UserRepositoryDatabase(connection);
const getUserById = new GetUserById(userRepository);
const userController = new UserControllerHttp(getUserById);
const routerFactory = new RouterFactory(productController, categoryController, userController);
const httpServer = new ExpressAdapter(routerFactory);
new ErrorHandler(httpServer);
httpServer.listen(3333);
