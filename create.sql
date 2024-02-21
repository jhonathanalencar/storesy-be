drop schema lak;
drop table lak.product_rate;
drop table lak.category;
drop table lak.discount;
drop table lak.product;
drop table lak.product_category;

create schema lak;
create table lak.product_rate (
  product_rate_id uuid primary key,
  user_id uuid not null,
  product_id uuid,
  score integer not null,
  description text not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  constraint product_user unique(product_id,user_id),
  constraint fk_product foreign key(product_id) references lak.product (product_id) on delete cascade
);
create table lak.category (
  category_id uuid primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);
create table lak.discount (
  discount_id uuid primary key,
  discount_percent numeric default 0,
  active boolean default false,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);
create table lak.product (
  product_id uuid primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  summary varchar(103) not null,
  price decimal not null,
  image_url text not null,
  discount_id uuid null references lak.discount (discount_id) on delete cascade,
  quantity numeric default 0,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  released_date timestamp null
);
create table lak.product_category (
  product_category_id serial primary key,
  product_id uuid,
  category_id uuid,
  constraint fk_product foreign key(product_id) references lak.product(product_id) on delete cascade,
  constraint fk_category foreign key(category_id) references lak.category(category_id) on delete cascade
);

insert into lak.category (category_id, name, slug) values ('4a7a41d1-879e-43ba-9e1b-6eab6e1b446b', 'Headphones', 'headphones');
insert into lak.category (category_id, name, slug) values ('d61ccf6d-b8f7-48a9-ba0e-a15b0050bfae', 'Technology', 'technology');
insert into lak.discount (discount_id, discount_percent, active) values ('e63d5eaa-dba7-4b5f-a4bd-3297a371a71c', 30, true);
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('7ddfb3ef-ec05-4f8c-8097-6d460deaf853', 'HarmonyPod Wireless Earbuds', 'harmonypod-wireless-earbuds', 'Immerse yourself in unparalleled audio bliss with HarmonyPod Wireless Earbuds. These sleek and compact earbuds deliver crystal-clear sound and deep bass, providing an immersive listening experience. With touch controls, a secure fit, and long-lasting battery life, HarmonyPod is the perfect companion for music lovers on the go. Elevate your auditory journey and embrace the harmony of superior sound quality with HarmonyPod Wireless Earbuds.', 'Immerse yourself in unparalleled audio bliss with HarmonyPod Wireless Earbuds. These sleek and compa...', 69.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'e63d5eaa-dba7-4b5f-a4bd-3297a371a71c', 24, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product_category (product_id, category_id) values ('7ddfb3ef-ec05-4f8c-8097-6d460deaf853', '4a7a41d1-879e-43ba-9e1b-6eab6e1b446b');
insert into lak.product_category (product_id, category_id) values ('7ddfb3ef-ec05-4f8c-8097-6d460deaf853', 'd61ccf6d-b8f7-48a9-ba0e-a15b0050bfae');
insert into lak.product_rate (product_rate_id, user_id, product_id, score, description) values ('f652b158-30ba-427b-9b45-bc9336c06179', '622e3a46-5463-4f55-81e6-932f564f8561', '7ddfb3ef-ec05-4f8c-8097-6d460deaf853', 4, 'good stuff');