-- customers
INSERT INTO customers (username, first_name, last_name, email)
VALUES
('jsmith','John','Smith','jsmith@test.com'),
('mmustermann','Max','Mustermann','mmustermann@test.com'),
('lharvey','Lee','harvey','lharvey@test.com'),
('lharvey','Lee','harvey','lharvey@test.com');

-- products
INSERT INTO products (name, description, is_hazardous, unit_size)
VALUES
('prod1','test product1',false,23),
('prod2','test product2',false,14),
('prod3','test product3',true,90),
('prod4','test product4',false,45),
('prod5','test product5',true,20),
('prod6','test product6',true,80),
('prod7','test product7',false,78),
('prod8','test product8',true,200);

-- warehouses
INSERT INTO warehouses (name, description, location, max_capacity, customer_id)
VALUES
('warehouse1','test warehouse1','USA',10000,1),
('warehouse2','test warehouse2','Germany',5000,2),
('warehouse3','test warehouse3','Germany',2000,1),
('warehouse4','test warehouse4','Italy',20000,3),
('warehouse5','test warehouse5','USA',90000,4),
('warehouse6','test warehouse6','Italy',20000,1);
