CREATE DATABASE bamazon_rm_db;
USE bamazon_rm_db;
CREATE TABLE bamazonItems(
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(60) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price NUMERIC(10,2),
    stock_quantity INTEGER(11),
    PRIMARY KEY (item_id)
    );
    Drop Table bamazonItems;
    
    ALTER TABLE bamazonitems MODIFY COLUMN price NUMERIC;
    
    	
	ALTER TABLE bamazonitems MODIFY price NUMERIC(5,2);

