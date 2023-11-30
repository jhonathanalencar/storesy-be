import { GetProductsByCategory } from './application/usecase/GetProductsByCategory';
import { MainController } from './infra/controller/MainController';
import { ExpressAdapter } from './infra/http/ExpressAdapter';
import { ProductsRepositoryMemory } from './infra/repository/ProductsRepositoryMemory';

const httpServer = new ExpressAdapter();
const productsRepository = new ProductsRepositoryMemory();
const getProductsByCategory = new GetProductsByCategory(productsRepository);
new MainController(httpServer, getProductsByCategory);
httpServer.listen(3333);
