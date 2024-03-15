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

#### GET `/products`

List products

#### POST `/products`

Create product

#### GET `/products/:productId`

Get product by ID

#### PUT `/products/:productId`

Update product

#### PATCH `/products/:productId/decrease`

Decrease product quantity

#### POST `/products/:productId/release`

Release product

#### POST `/products/:productId/rating`

Create product rating

#### GET `/category/:category/products`

Get products by category

#### GET `/slug/:slug/products`

Get product by slug

#### GET `/slug/:slug/ratings`

Get product ratings

#### GET `/deals`

List deals

#### GET `/best-sellers`

List best sellers

#### GET `/search`

Search products

### Category

#### GET `/category`

List categories

#### POST `/category`

Create category

#### GET `/category/:categoryId`

Get category by ID

#### PUT `/category/:categoryId`

Update category

### User

#### GET `/user/:userId`

Get user by ID

## 📝 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  <img src="https://user-images.githubusercontent.com/87830705/254344973-58fb1280-be15-4847-95bd-c99236abdb4b.png" width="5%">
</p>
