<h1 align="center">Storesy Catalog API</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=ac7c59&labelColor=4b2428">
</p>

<br>

<p align="center">
  <img src=".github/cover.png">
</p>

## 💻 Projeto

Sistema de listagem, criação, edição e remoção de produtos, categorias e usuários.

## 🧪 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Zod](https://zod.dev/)

## 🚀 Como executar

```bash
# Clone este repositório
$ git clone https://github.com/jhonathanalencar/storesy-be.git

# Entre na pasta
$ cd storesy-be

# Instale as dependências
$ npm install

# Copie e preencha as variáveis de ambiente do arquivo .env.example em um arquivo .env

# Crie e inicie os containers
$ docker compose up

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# A aplicação inciará na porta:3333
acesse <http://localhost:3333>
```

## Rotas da aplicação

### Product

- [x] GET `/products`

  List products

- [x] POST `/products`

  Create product

- [x] GET `/products/:productId`

  Get product by ID

- [x] PUT `/products/:productId`

  Update product

- [x] PATCH `/products/:productId/decrease`

  Decrease product quantity

- [x] POST `/products/:productId/release`

  Release product

- [x] POST `/products/:productId/rating`

  Create product rating

- [x] GET `/category/:category/products`

  Get products by category

- [x] GET `/slug/:slug/products`

  Get product by slug

- [x] GET `/slug/:slug/ratings`

  Get product ratings

- [x] GET `/deals`

  List deals

- [x] GET `/best-sellers`

  List best sellers

- [x] GET `/search`

  Search products

### Category

- [x] GET `/category`

  List categories

- [x] POST `/category`

  Create category

- [x] GET `/category/:categoryId`

  Get category by ID

- [x] PUT `/category/:categoryId`

  Update category

### User

- [x] GET `/user/:userId`

  Get user by ID

## 📝 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  <img src="https://user-images.githubusercontent.com/87830705/254344973-58fb1280-be15-4847-95bd-c99236abdb4b.png" width="5%">
</p>
