drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products (
    item_id int not null,
    product_name varchar(50) null,
    department_name varchar(50) null,
    price decimal(7, 2) null,
    stock_quantity int not null,
    primary key (item_id)
);

insert into products (item_id, product_name, department_name, price, stock_quantity)
values (1, "Acme TNT", "Explosives", 25.00, 500), 
(2, "Acme Sledgehammer", "Tools", 10.00, 1000),
(3, "Acme Instant Road", "Construction", 1000.00, 250),
(4, "Acme Bow & Arrow", "Hunting", 200.00, 500),
(5, "Acme Spring-Loaded Boxing Glove", "Booby Traps", 50.00, 100),
(6, "Acme Roller Skates", "Sporting Goods", 20.00, 100),
(7, "Acme Plywood", "Construction", 10.00, 300),
(8, "Acme Painting Canvas", "Arts and Crafts", 20.00, 300),
(9, "Acme Trampolene", "Recreation", 200.00, 100),
(10, "Acme Invisible Paint", "Arts and Crafts", 50, 200),
(11, "Acme Cactus Costume", "Constumes", 10.00, 100),
(12, "Acme Earthquake Pills", "Pharmacy", 25.00, 100)