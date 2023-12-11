## Description

This is a monorepo for microservice application to run a warehouse system.

To start in a dev environment run:
```
npm run docker-compose:dev
```

this will run four containers:
- PostgreSQL (username: postgres, pass: postgres)
- pgAdmin at http://localhost:5050/ (username: admin@admin.com, pass: postgres)
- Warehouses service at http://localhost:3000
- Calculations service at http://localhost:3001


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Supported API requests
- Fetch a list of warehouses (for a customer)
- Fetch products list
- Add, edit and remove existing products and mark them as hazardous or not
- Import or export products to a warehouse
- Fetch the current stock amount per warehouse and in general and free stock space remaining
- Fetch historic list of imports and exports per date and/or warehouses

## User scenarios
- User can create a product and make it (not) hazardous
- After product creation, if the product is already imported into at least one warehouse, it should not be possible
to change the properties [is_hazardous, unit_size], otherwise it'll break the storage rule
- A warehouse should be fetched per a certain owner by owner_id
- An import/export history should be fetched per owner by owner_id

- Before importing a product with certain quantity, the service must do a validation for a specific date (now or future) (if the amount for a date does note exceed the max_capacity of a warehouse), for this purpose two models are introduced: [transaction, inventory]
```
  - The transactions table keeps all import/export operations with a timestamp.
  - The inventory table represents the snapshot of the inventory at a specific date.
```

- As the amount of products in the future is a dynamic unknown upfront value, which depends on the existing stored amount and
the amounts which can possibly be imported/exported in between, we need to set specific boundaries and calculation rules:
```
  - The date/time of import/export is simplified just to a date, the time is not taken into account, but surely in real life the time matters
  - The future import can be done no later than a month from today (import frame/window)
  - If the import operation is greater than a month from today, it'll be rejected
  - The inventory record keeps the information on a specific product/effectiveDate per warehouse and will be re-calculated
    on every import/export operation in order to represent the actual snapshot of the inventory at a specific date
  - To get a today's snapshot for the warehouse available capacity, we can just select the inventory records by date, warehouseId
  - In order to keep the inventory snapshots in the actual state for every day, we need to run a calculation task every day, it'll take the previous day inventory state and does re-calculation for the current one due to the following reason:
        * no operations can be done for a current day and we need to fill/calculate the inventory
        * a current day can already have future imports so again a re-calculation is needed
        * the calculation service exposes an API endpoint '/api/submit-transaction' to run a task, but it can be triggered by cron job or any other trigger mechanism
```



## Transaction model
Keeps the data about any valid import/export operation for a specific date, the import operation can be done now or in the future,
the transaction keeps the date of creation.
```
{
  id: number;
  created_at: Date;
  updated_at: Date;
  transaction_type: ['IMPORT', 'EXPORT'];
  quantity: number;
  size: number;
  product_id: number;
  warehouse_id: number;
  transaction_date: string;
}
```

## Inventory model
Keeps the data about a certain inventory amount for a specific product/date.
```
{
  id: number;
  created_at: Date;
  updated_at: Date;
  quantity: number;
  size: number;
  effective_date: string;
  warehouse_id: number;
  product_id: number;
}
```

NB: Stock calculation is simplified, a product has a unit_size (assumed as the (height * width * length) area occupied), the total occupied
area is calculated as unit_size * items_number and it should not be greater than the warehouse max_capacity.

Examples of GraphQL API queries (served at http://localhost:3000/graphql):
```
query WarehousesQuery {
    warehouses {
        name,
        description,
        location,
        isHazardous,
        maxCapacity
    }
}
```
```
query CustomersQuery {
    customers {
        createdAt
        updatedAt
        username,
        firstName,
        lastName,
        email
    }
}
```
```
query CustomerQuery {
    customer(id: 3) {
        username,
        firstName,
        lastName,
        email
    }
}
```
```
mutation CustomerMutation {
    createCustomer(customerData: {
        username: "testuser2",
        firstName: "Test2",
        lastName: "User",
        email: "tuser2@test.com"
    }) {
        id,
        username,
        firstName,
        lastName,
        email
    }
}

```
```
query ProductsQuery {
    products {
        name,
        description,
        isHazardous,
        unitSize
    }
}
```
```
query WarehousesQuery {
    warehouses {
        name,
        description,
        location
    }
}
```
```
query WarehousesByCustomerQuery {
    warehousesByOwner(customerId: 1) {
        name,
        description,
        location,
        maxCapacity
    }
}
```
```
mutation WarehouseMutation {
    createWarehouse(warehouseData: {
        name: "warehouse16",
        description: "warehouse16 description",
        location: "France",
        maxCapacity: 1000,
        customerId: 1
    }) {
        name,
        description,
        location
    }
}
```
```
query TransactionsHistoryQuery {
    transactionsHistoryByWarehouse(warehouseId:1) {
        transactionType,
        quantity,
        size,
        transactionDate
    }
}
```
