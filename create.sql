drop schema lak;
drop table lak.product_rate;
drop table lak.product_category;
drop table lak.category;
drop table lak.product;
drop table lak.discount;

create schema lak;
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
create table lak.product_category (
  product_category_id serial primary key,
  product_id uuid,
  category_id uuid,
  constraint fk_product foreign key(product_id) references lak.product(product_id) on delete cascade,
  constraint fk_category foreign key(category_id) references lak.category(category_id) on delete cascade
);
create table verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,

  PRIMARY KEY (identifier, token)
);
create table accounts (
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,

  PRIMARY KEY (id)
);
create table sessions (
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,

  PRIMARY KEY (id)
);
create table users (
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,

  PRIMARY KEY (id)
);

insert into lak.category (category_id, name, slug) values ('4a7a41d1-879e-43ba-9e1b-6eab6e1b446b', 'Headphones', 'headphones');
insert into lak.category (category_id, name, slug) values ('d61ccf6d-b8f7-48a9-ba0e-a15b0050bfae', 'Technology', 'technology');
insert into lak.category (category_id, name, slug) values ('75a42828-8974-4162-980b-ab056e4c674d', 'Sustainability', 'sustainability');
insert into lak.category (category_id, name, slug) values ('6858722f-012b-4761-9ea4-dc594cfc9d48', 'Toothbrush', 'toothbrush');
insert into lak.category (category_id, name, slug) values ('eb4dba23-0b5e-4112-97f6-0425b5e7f925', 'Oral Care', 'oral-care');
insert into lak.category (category_id, name, slug) values ('b6e92156-ab9d-4b96-881b-d8dadc3263e5', 'Fitness', 'fitness');
insert into lak.category (category_id, name, slug) values ('08796540-071a-4ce2-972e-a38a4f1118e1', 'Digital Watch', 'digital-watch');
insert into lak.category (category_id, name, slug) values ('bb318c75-34bd-46c7-bc60-20ed1b46172e', 'Charger', 'charger');
insert into lak.category (category_id, name, slug) values ('55df9704-443f-46b5-9454-63b187867bb6', 'Electronics', 'electronics');
insert into lak.category (category_id, name, slug) values ('1a94ad88-8793-47ed-aa18-2ba46b3f1f7d', 'Organic', 'organic');
insert into lak.category (category_id, name, slug) values ('0a6bfddf-34e9-4863-8e3b-3058b6fd6618', 'Healthy', 'healthy');
insert into lak.category (category_id, name, slug) values ('b62d5dca-2626-4ba8-97b5-5579c1856165', 'Natural', 'natural');
insert into lak.discount (discount_id, discount_percent, active) values ('e63d5eaa-dba7-4b5f-a4bd-3297a371a71c', 30, true);
insert into lak.discount (discount_id, discount_percent, active) values ('6e27cf34-6c50-4218-986b-2b38da9658d7', 5, true);
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('7ddfb3ef-ec05-4f8c-8097-6d460deaf853', 'HarmonyPod Wireless Earbuds', 'harmonypod-wireless-earbuds', 'Immerse yourself in unparalleled audio bliss with HarmonyPod Wireless Earbuds. These sleek and compact earbuds deliver crystal-clear sound and deep bass, providing an immersive listening experience. With touch controls, a secure fit, and long-lasting battery life, HarmonyPod is the perfect companion for music lovers on the go. Elevate your auditory journey and embrace the harmony of superior sound quality with HarmonyPod Wireless Earbuds.', 'Immerse yourself in unparalleled audio bliss with HarmonyPod Wireless Earbuds. These sleek and compa...', 69.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'e63d5eaa-dba7-4b5f-a4bd-3297a371a71c', 24, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('6abe914d-31ae-4a77-b2da-c1333402aaa0', 'EcoFresh Bamboo Toothbrush Set', 'ecofresh-bamboo-toothbrush-set', 'Make your daily routine eco-friendly with the EcoFresh Bamboo Toothbrush Set. Crafted from sustainably sourced bamboo, these toothbrushes offer a stylish and environmentally conscious alternative to traditional plastic brushes. The set includes four brushes with charcoal-infused bristles for a refreshing clean. Upgrade your oral care routine while contributing to a greener planet with the EcoFresh Bamboo Toothbrush Set.', 'Make your daily routine eco-friendly with the EcoFresh Bamboo Toothbrush Set. Crafted from sustainab...', 14.99, 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '6e27cf34-6c50-4218-986b-2b38da9658d7', 10, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('cabce1b7-88c9-411d-855d-02ec41c19b3f', 'GloFit Smart Fitness Tracker', 'glofit-smart-fitness-tracker', 'Revolutionize your fitness journey with the GloFit Smart Fitness Tracker. Packed with advanced features, this sleek wearable is your personal health companion. Track your steps, monitor heart rate, analyze sleep patterns, and receive real-time notifications seamlessly. With a vibrant touch display and water-resistant design, the GloFit ensures you stay connected and motivated throughout your day. Elevate your fitness experience and embrace a healthier, more informed lifestyle with the GloFit Smart Fitness Tracker.', 'Revolutionize your fitness journey with the GloFit Smart Fitness Tracker. Packed with advanced featu...', 79.99, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', null, 12, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('953960a8-a883-42ce-a6ce-2f49f3024cf3', 'TechPro Plus Wireless Charging Station', 'techpro-plus-wireless-charging-station', 'Unleash the future of charging with the TechPro Plus Wireless Charging Station. This cutting-edge device combines sleek design with high-tech functionality, offering fast and efficient wireless charging for your essential gadgets. With multiple charging pads and universal compatibility, its a versatile solution for your smartphone, smartwatch, and earbuds. Elevate your charging experience and declutter your space with the TechPro Plus Wireless Charging Station — where innovation meets convenience. Act fast, as only 150 units are available!', 'Unleash the future of charging with the TechPro Plus Wireless Charging Station. This cutting-edge de...', 79.99, 'https://images.unsplash.com/photo-1615526675250-dbe5d4302ae0?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', null, 150, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('a6781dd8-d185-43bb-a323-b6c6c310ae3b', 'EcoBlend Organic Tea Sampler', 'ecoblend-organic-tea-sampler', 'Savor the finest organic teas with our EcoBlend Organic Tea Sampler. This exquisite set features a curated selection of premium, sustainably sourced teas that promise a journey of flavors. From soothing chamomile to robust black tea, each blend is carefully chosen to elevate your tea-drinking experience. Limited to 300 sets, embrace the art of tea with the EcoBlend Organic Tea Sampler and treat your senses to a symphony of natural and delightful aromas.', 'Savor the finest organic teas with our EcoBlend Organic Tea Sampler. This exquisite set features a c...', 29.99, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', null, 300, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('8d3d32e7-f8a6-4623-a8a4-15fce9cdbf41', 'SereneSound Noise-Canceling Headphones', 'serenesound-noise-canceling-headphones', 'Immerse yourself in a world of tranquility with the SereneSound Noise-Canceling Headphones. Designed for supreme comfort and exceptional sound quality, these headphones transport you to a realm of pure audio bliss. With advanced noise-canceling technology, you can escape the hustle and bustle of the world around you. Limited to just 100 units, the SereneSound headphones redefine your listening experience. Elevate your auditory journey and secure your pair now for a serene escape into music like never before.', 'Immerse yourself in a world of tranquility with the SereneSound Noise-Canceling Headphones. Designed...', 129.99, 'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', null, 100, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product (product_id, name, slug, description, summary, price, image_url, discount_id, quantity, created_at, updated_at, released_date)
values ('f2d3c435-dcbe-4901-849a-0c8ce4902391', 'BioHarmony Plant-Based Protein Powder', 'bioharmony-plant-based-protein-powder', 'Fuel your body with the goodness of BioHarmony Plant-Based Protein Powder. This nutritional powerhouse combines premium plant proteins for a delicious and complete source of essential amino acids. Perfect for post-workout recovery or as a daily supplement, BioHarmony supports your active lifestyle. With only 250 units available, grab your stash of this delectable protein powder and embrace the harmony of nourishing your body naturally.', 'Fuel your body with the goodness of BioHarmony Plant-Based Protein Powder. This nutritional powerhou...', 39.99, 'https://images.unsplash.com/photo-1622485831129-b820c2891f4e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', null, 50, '2023-12-10T10:00:00', '2023-12-10T10:00:00', '2023-12-13T10:00:00');
insert into lak.product_category (product_id, category_id) values ('7ddfb3ef-ec05-4f8c-8097-6d460deaf853', '4a7a41d1-879e-43ba-9e1b-6eab6e1b446b');
insert into lak.product_category (product_id, category_id) values ('7ddfb3ef-ec05-4f8c-8097-6d460deaf853', 'd61ccf6d-b8f7-48a9-ba0e-a15b0050bfae');
insert into lak.product_category (product_id, category_id) values ('6abe914d-31ae-4a77-b2da-c1333402aaa0', '75a42828-8974-4162-980b-ab056e4c674d');
insert into lak.product_category (product_id, category_id) values ('6abe914d-31ae-4a77-b2da-c1333402aaa0', '6858722f-012b-4761-9ea4-dc594cfc9d48');
insert into lak.product_category (product_id, category_id) values ('6abe914d-31ae-4a77-b2da-c1333402aaa0', 'eb4dba23-0b5e-4112-97f6-0425b5e7f925');
insert into lak.product_category (product_id, category_id) values ('cabce1b7-88c9-411d-855d-02ec41c19b3f', 'd61ccf6d-b8f7-48a9-ba0e-a15b0050bfae');
insert into lak.product_category (product_id, category_id) values ('cabce1b7-88c9-411d-855d-02ec41c19b3f', 'b6e92156-ab9d-4b96-881b-d8dadc3263e5');
insert into lak.product_category (product_id, category_id) values ('cabce1b7-88c9-411d-855d-02ec41c19b3f', '08796540-071a-4ce2-972e-a38a4f1118e1');
insert into lak.product_category (product_id, category_id) values ('953960a8-a883-42ce-a6ce-2f49f3024cf3', 'd61ccf6d-b8f7-48a9-ba0e-a15b0050bfae');
insert into lak.product_category (product_id, category_id) values ('953960a8-a883-42ce-a6ce-2f49f3024cf3', 'bb318c75-34bd-46c7-bc60-20ed1b46172e');
insert into lak.product_category (product_id, category_id) values ('953960a8-a883-42ce-a6ce-2f49f3024cf3', '55df9704-443f-46b5-9454-63b187867bb6');
insert into lak.product_category (product_id, category_id) values ('a6781dd8-d185-43bb-a323-b6c6c310ae3b', '1a94ad88-8793-47ed-aa18-2ba46b3f1f7d');
insert into lak.product_category (product_id, category_id) values ('a6781dd8-d185-43bb-a323-b6c6c310ae3b', '0a6bfddf-34e9-4863-8e3b-3058b6fd6618');
insert into lak.product_category (product_id, category_id) values ('8d3d32e7-f8a6-4623-a8a4-15fce9cdbf41', '55df9704-443f-46b5-9454-63b187867bb6');
insert into lak.product_category (product_id, category_id) values ('8d3d32e7-f8a6-4623-a8a4-15fce9cdbf41', '4a7a41d1-879e-43ba-9e1b-6eab6e1b446b');
insert into lak.product_category (product_id, category_id) values ('8d3d32e7-f8a6-4623-a8a4-15fce9cdbf41', 'd61ccf6d-b8f7-48a9-ba0e-a15b0050bfae');
insert into lak.product_category (product_id, category_id) values ('f2d3c435-dcbe-4901-849a-0c8ce4902391', '0a6bfddf-34e9-4863-8e3b-3058b6fd6618');
insert into lak.product_category (product_id, category_id) values ('f2d3c435-dcbe-4901-849a-0c8ce4902391', 'b62d5dca-2626-4ba8-97b5-5579c1856165');
insert into lak.product_rate (product_rate_id, user_id, product_id, score, description) values ('f652b158-30ba-427b-9b45-bc9336c06179', '622e3a46-5463-4f55-81e6-932f564f8561', '7ddfb3ef-ec05-4f8c-8097-6d460deaf853', 4, 'Ive been using these for over a year now, and have no complaints. They do not have active noise cancelation but do reduce outside noise to an extent just from blocking your ear. Sound quality is good, not as good as some headsets but competitive to other wireless earbuds without the cost some brands present. they are light and comfortable over long use. The battery life isnt as high as some more expensive models claim to have but the earbuds will still last you through a normal days use and the case battery can recharge the earbuds empty to full 4 times before needing to be charged itself, making the battery plenty for most users.');
insert into lak.product_rate (product_rate_id, user_id, product_id, score, description) values ('9a980cbe-10ff-4208-bcd3-e2e40dff6f86', '622e3a46-5463-4f55-81e6-932f564f8561', '6abe914d-31ae-4a77-b2da-c1333402aaa0', 5, 'Best price around for decent toothbrushes. Does the job and bristles are soft enough to as not to damage gums.');