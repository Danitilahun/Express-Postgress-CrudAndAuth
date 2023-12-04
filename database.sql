CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
    refreshToken VARCHAR UNIQUE
);

INSERT INTO users(username, passhash, refreshToken) values($1,$2,$3);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  rating FLOAT,
  price DECIMAL(10, 2)
);

INSERT INTO books(title, author, description, category, rating, price) values($1,$2,$3,$4,$5,$6);