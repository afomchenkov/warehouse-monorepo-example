DROP TABLE IF EXISTS customer;
CREATE TABLE customer (
   id SERIAL PRIMARY KEY,
   username VARCHAR(100),
   first_name VARCHAR(100),
   last_name VARCHAR(100),
   phone VARCHAR(100),
   email VARCHAR(100),
);

DROP TABLE IF EXISTS product;
CREATE TABLE product (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100),
   description TEXT,
   is_hazardous BOOLEAN,
   unit_size VARCHAR(20), -- Size of the product
);

DROP TABLE IF EXISTS warehouse;
CREATE TABLE warehouse (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100),
   location VARCHAR(255),
   owner_id INTEGER REFERENCES customer(id),
   max_capacity INTEGER, -- Maximum size capacity of the warehouse (total area - square meters/cube size)
);

DROP TABLE IF EXISTS inventory;
-- Tracks the current inventory of products in each warehouse, including the quantity, size,
-- and a timestamp for effective date range tracking
CREATE TABLE inventory (
   id SERIAL PRIMARY KEY,
   product_id INTEGER REFERENCES product(id),
   warehouse_id INTEGER REFERENCES warehouse(id),
   quantity INTEGER,
   size VARCHAR(20), -- Size of the product in the warehouse
   -- allows for temporal data modeling, which is useful when dealing with transactions in the past or the future
   effective_date TIMESTAMP,
   CONSTRAINT unique_inventory UNIQUE (product_id, warehouse_id, size, effective_date)
);

DROP TABLE IF EXISTS transaction_record;
-- Records transactions such as imports and exports, including the size of the products and the timestamp for the transaction
CREATE TABLE transaction_record (
   id SERIAL PRIMARY KEY,
   -- owner_id INTEGER REFERENCES customer(id), -- keep transaction creator
   product_id INTEGER REFERENCES products(product_id),
   warehouse_id INTEGER REFERENCES warehouses(warehouse_id),
   transaction_type VARCHAR(10), -- 'import' or 'export' enum
   quantity INTEGER,
   size VARCHAR(20), -- Size of the product in the transaction
   transaction_date TIMESTAMP,
   CONSTRAINT valid_transaction_date CHECK (transaction_date <= CURRENT_TIMESTAMP)
);

-- Products-Warehouses Relationship
-- A product can be stored in multiple warehouses, and a warehouse can store multiple products
ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_product
FOREIGN KEY (product_id) REFERENCES product(id);

ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_warehouse
FOREIGN KEY (warehouse_id) REFERENCES warehouse(id);

-- Transactions-Products-Warehouses Relationships
-- A transaction involves a specific product and a specific warehouse, including the size of the product
ALTER TABLE transaction_record
ADD CONSTRAINT fk_transactions_product
FOREIGN KEY (product_id) REFERENCES product(id);

ALTER TABLE transaction_record
ADD CONSTRAINT fk_transactions_warehouse
FOREIGN KEY (warehouse_id) REFERENCES warehouse(id);

-- Inventory-Transactions Relationships
-- Connects transactions to the inventory, specifying the effective date for each inventory update
ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_transaction
FOREIGN KEY (product_id, warehouse_id, size, effective_date)
REFERENCES transaction_record(product_id, warehouse_id, size, transaction_date);
