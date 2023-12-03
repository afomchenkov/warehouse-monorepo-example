-- customers
INSERT INTO customers (username, first_name, last_name, email)
VALUES('jsmith','John','Smith','jsmith@test.com');
INSERT INTO customers (username, first_name, last_name, email)
VALUES('mmustermann','Max','Mustermann','mmustermann@test.com');
INSERT INTO customers (username, first_name, last_name, email)
VALUES('lharvey','Lee','harvey','lharvey@test.com');
INSERT INTO customers (username, first_name, last_name, email)
VALUES('lharvey','Lee','harvey','lharvey@test.com');

-- products
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod1','test product1',false,23);
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod2','test product2',false,14);
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod3','test product3',true,90);
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod4','test product4',false,45);
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod5','test product5',true,20);
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod6','test product6',true,80);
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod7','test product7',false,78);
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES('prod8','test product8',true,200);

-- warehouses
INSERT INTO warehouses (name, description, location, max_capacity, customer_id)
VALUES('warehouse1','test warehouse1','USA',10000,1);
INSERT INTO warehouses (name, description, location, max_capacity, customer_id)
VALUES('warehouse2','test warehouse2','Germany',5000,2);
INSERT INTO warehouses (name, description, location, max_capacity, customer_id)
VALUES('warehouse3','test warehouse3','Germany',2000,1);
INSERT INTO warehouses (name, description, location, max_capacity, customer_id)
VALUES('warehouse4','test warehouse4','Italy',20000,3);
INSERT INTO warehouses (name, description, location, max_capacity, customer_id)
VALUES('warehouse5','test warehouse5','USA',90000,4);
INSERT INTO warehouses (name, description, location, max_capacity, customer_id)
VALUES('warehouse6','test warehouse6','Italy',20000,1);
