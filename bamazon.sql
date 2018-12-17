DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INTEGER(11) NOT NULL AUTO_INCREMENT,
prod_name VARCHAR(25),
dept_name VARCHAR(25),
price DECIMAL(11,2),
stock INTEGER(11),
PRIMARY KEY (item_id)
);

select * from products;

INSERT INTO products(prod_name,dept_name,price,stock)
VALUES("mug","home goods",4.99,50),
("learn to code","books",19.99,200),
("sweater","clothes",29.99,150),
("hat","clothes",19.99,4),
("cat toy","pet goods",2.99,17),
("cat food","pet goods",39.99,12),
("dog toy","pet goods",3.99,123),
("dog bed","pet goods",19.99,10),
("d20 set","games",9.99,40),
("d6 set","games",8.99,43),
("game manual","books",49.99,20)
;





