DROP TABLE IF EXISTS roles CASCADE;
create table roles(
	id BIGSERIAL PRIMARY KEY,
	name varchar(100) not null unique,
	image varchar(255) null,
	route varchar(255) null,
	created_at timestamp not null,
	updated_at timestamp not null
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email varchar(100) NOT NULL UNIQUE,
	name varchar(100) not null,
	lastname varchar(100) not null,
	phone varchar(80) not null unique,
	image varchar(255) null,
	password varchar(100) not null,
	is_available boolean null,
	session_token varchar(255) null,
	created_at timestamp not null,
	updated_at timestamp not null
);

DROP TABLE IF EXISTS user_has_roles CASCADE;
create table user_has_roles(
	id_user BIGSERIAL not null,
	id_role BIGSERIAL not null,
	created_at timestamp not null,
	updated_at timestamp not null,
	FOREIGN KEY(id_user) references users(id) on update CASCADE on delete CASCADE,
	FOREIGN KEY(id_role) references roles(id) on update CASCADE on delete CASCADE,
	PRIMARY KEY(id_user, id_role)
)

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL,
	price DECIMAL DEFAULT 0,
	image1 VARCHAR(255) NULL,
	image2 VARCHAR(255) NULL,
	image3 VARCHAR(255) NULL,
	id_category BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS adress CASCADE;
CREATE TABLE adress(
	id BIGSERIAL PRIMARY KEY,
	id_user BIGINT NOT NULL,
	adress VARCHAR(255) NOT NULL,
	neigborhood VARCHAR(255) NOT NULL,
	lat DECIMAL DEFAULT 0,
	lng DECIMAL DEFAULT 0,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
	id BIGSERIAL PRIMARY KEY,
	id_client BIGINT NOT NULL,
	id_delivery BIGINT NULL,
	id_address BIGINT NOT NULL,
	lat DECIMAL DEFAULT 0,
	lng DECIMAL DEFAULT 0,
	status VARCHAR(90) NOT NULL,
	timestamp BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY (id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
)

DROP TABLE IF EXISTS orders_has_products CASCADE;
CREATE TABLE orders_has_products(
	id_order BIGINT NOT NULL,
	id_product BIGINT NOT NULL,
	quantity BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	PRIMARY KEY(id_order, id_product),
	FOREIGN KEY (id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
)

insert into roles(
	name,
	route,
	image,
	created_at,
	updated_at
)

values(
	'CLIENTE',
	'client/home',
	'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
	'2024-04-01',
	'2024-04-01'
);

insert into roles(
	name,
	route,
	image,
	created_at,
	updated_at
)

values(
	'RESTAURANTE',
	'restaurant/home',
	'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
	'2024-04-01',
	'2024-04-01'
);

insert into roles(
	name,
	route,
	image,
	created_at,
	updated_at
)

values(
	'REPARTIDOR',
	'delivery/home',
	'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
	'2024-04-01',
	'2024-04-01'
);