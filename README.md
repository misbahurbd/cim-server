# Computer Item Management System - Assignment - B2 - 06 - MisbahurBD

Welcome to the Computer Item Management System.

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/Porgramming-Hero-web-course/l2-b2-assignment-6-backend-misbahurbd.git
```

### 2. Open project directory:

```bash
cd l2-b2-assignment-6-backend-misbahurbd
```

### 3. Install dependencies:

```bash
npm install
```

### 4. Configuration:

Before starting the project, you need to configure the environment by creating an `.env` file in the project root with the following content:

```env
NODE_ENV="development"
PORT="5000"
MONGODB_URL=<mongodb_url_here>
HASH_ROUND=<NUMBER_OF_HASH_ROUND>
JWT_ACCESS_SECRET=<SECRET_STRING>

NODE_ENV="development"
MONGODB_URL=<MONGODB_URL_HERE>
CLIENT_URL=<CLIENT_BASE_URL>
PORT="5000"
HASH_ROUND=8
JWT_ACCESS_SECRET=<JWT_ACCESS_SECRET>
JWT_REFRESH_SECRET=<JWT_REFRESH_SECRET>

CLOUDINARY_CLOUD_NAME=<CLOUD_NAME>
CLOUDINARY_API_KEY=<API_KEY>
CLOUDINARY_API_SECRET=<API_SECRET>
```

### 5. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000` as `PORT` on .env file

## Auth API Endpoints

### 1. Register User:

- Endpoint: **POST /api/auth/register**
- Request body: Contain user data object in JSON.
- Example URL: `http://localhost:5000/api/auth/register`
- Example request body:

```json
{
  "name": "Person Name",
  "email": "example@gmail.com",
  "phone": "+880170000000",
  "stateAddress": "Amborkhana",
  "city": "Sylhet",
  "country": "Bangladesh",
  "role": "buyer",
  "password": "Pass@000",
  "confirmPassword": "Pass@000"
}
```

#### Example response

```json
{
  "success": true,
  "message": "User registered successfully",
  "statusCode": 201,
  "data": {
    "name": "Person Name",
    "email": "example@gmail.com",
    "hashedPassword": "$2b$08$GhGsD6w8ToGjEeQdeSyNhetxFUS5YFNTKSFTWXWL6DR59SMwzJ0JG",
    "phone": "+880170000000",
    "stateAddress": "Amborkhana",
    "city": "Sylhet",
    "country": "Bangladesh",
    "role": "buyer",
    "_id": "65b916d567a6b325dc426a45",
    "createdAt": "2024-01-30T15:33:41.674Z",
    "updatedAt": "2024-01-30T15:33:41.674Z"
  }
}
```

### 2. Login User:

- Endpoint: **POST /api/auth/login**
- Request body: Contain user credentials in JSON.
- Example URL: `http://localhost:5000/api/auth/login`
- Example request body:

```json
{
  "email": "example@gmail.com",
  "password": "Pass@000"
}
```

#### Example response

```json
{
  "success": true,
  "message": "User login successful",
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjkxNmQ1NjdhNmIzMjVkYzQyNmE0NSIsImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20iLCJpYXQiOjE3MDY2Mjg4OTAsImV4cCI6MTcwNjcxNTI5MH0.m0ddbcyPZOCo6X6dlMjNmfi6Fb62A95YfL7PU6PdcpI"
  }
}
```

### 3. Refresh Token:

- Endpoint: **GET /api/auth/refresh-token**
- Request Cookies: Contain refresh token inside cookies.
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/auth/login`

#### Example response

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjkwZTc3MjQ3NzAxMWZiMzZhYzY1OCIsImVtYWlsIjoibWlzYmFodXJiZEBnbWFpbC5jb20iLCJpYXQiOjE3MDY2MjY4ODcsImV4cCI6MTcwNjcxMzI4N30.-mfk9FNS4gMyuYxqaPkExJhu40qfdEMkUACPvwjyUII"
  }
}
```

## Product API Endpoints

### 4. Create product:

- Endpoint: **POST /api/products**
- Request body: Contain product data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Only buyer can do this operation
- Example URL: `http://localhost:4000/api/products`
- Example Request Body:

```json
{
  "name": "MSI 4GB DDR4 Graphics Card",
  "price": 4300,
  "quantity": 30,
  "image": "https://examplewebsite.com/images/product-image.jpg",
  "category": "658d8521793ec53679ccc41e",
  "brand": "658d8534793ec51139ccb92d",
  "condition": "new",
  "compatibility": ["windows", "linux"],
  "interface": ["HTML", "WIFI"],
  "capacity": "4GB"
}
```

#### Example response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product created successfully",
  "data": {
    "name": "MSI 4GB DDR4 Graphics Card",
    "price": 4300,
    "image": "https://examplewebsite.com/images/product-image.jpg",
    "quantity": 30,
    "condition": "new",
    "category": "658d8521793ec53679ccc41e",
    "brand": "658d8534793ec51139ccb92d",
    "compatibility": ["windows", "linux"],
    "interface": ["HTML", "WIFI"],
    "capacity": "4GB",
    "isDeleted": false,
    "_id": "65b9116e2477011fb36ac65f",
    "__v": 0
  }
}
```

### 5. Get All Products with Pagination and filter:

- Endpoint: **GET /api/products**
- Request Headers: `Authorization: <JWT_TOKEN>`
- Use Params to Paginate and Filter
- Searchable Field: `name`
- Filterable Field: `category`, `brand`, `compatibility`, `condition`, `interface`, `capacity`
- Example URL: `http://localhost:5000/api/products?category=RAM&page=2&limit=5`

#### Example response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products fetched successfully",
  "data": {
    "page": 1,
    "limit": 5,
    "skip": 0,
    "maxPrice": 22,
    "minPrice": 14,
    "total": 2,
    "products": [
      {
        "_id": "65b91a34381e43aa9659bf00",
        "name": "TEAM DELTA UD 4GB 2666MHz RGB DDR4 Desktop RAM",
        "price": 22,
        "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629613/products/hrjsf2tmsefkxvi35s9u.jpg",
        "quantity": 93,
        "condition": "new",
        "compatibility": ["windows", "linux"],
        "interface": ["sata"],
        "capacity": "4GB",
        "isDeleted": false,
        "__v": 0,
        "category": {
          "_id": "65b91a0f381e43aa9659bef6",
          "name": "RAM",
          "createdAt": "2024-01-30T15:47:27.448Z",
          "updatedAt": "2024-01-30T15:47:27.448Z",
          "__v": 0
        },
        "brand": {
          "_id": "65b91a1d381e43aa9659befb",
          "name": "Team",
          "createdAt": "2024-01-30T15:47:41.373Z",
          "updatedAt": "2024-01-30T15:47:41.373Z",
          "__v": 0
        }
      },
      {
        "_id": "65b91a77381e43aa9659bf0c",
        "name": "Apacer Panther Golden 4GB DDR4 2666MHZ Desktop RAM",
        "price": 14,
        "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629711/products/nynojkka9vjljvh1vlbo.jpg",
        "quantity": 20,
        "condition": "new",
        "compatibility": ["windows", "linux"],
        "interface": ["sata"],
        "capacity": "4GB",
        "isDeleted": false,
        "__v": 0,
        "category": {
          "_id": "65b91a0f381e43aa9659bef6",
          "name": "RAM",
          "createdAt": "2024-01-30T15:47:27.448Z",
          "updatedAt": "2024-01-30T15:47:27.448Z",
          "__v": 0
        },
        "brand": {
          "_id": "65b91a62381e43aa9659bf07",
          "name": "Apacer",
          "createdAt": "2024-01-30T15:48:50.272Z",
          "updatedAt": "2024-01-30T15:48:50.272Z",
          "__v": 0
        }
      }
    ],
    "filterValue": {
      "capacities": ["4GB", "2GB"],
      "interfaces": ["sata", "displayport", "hdmi"]
    }
  }
}
```

### 6. Get Single Product:

- Endpoint: **GET /api/products/:id**
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/products/:id`

#### Example response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product fetched successfully",
  "data": {
    "_id": "65b91a77381e43aa9659bf0c",
    "name": "Apacer Panther Golden 4GB DDR4 2666MHZ Desktop RAM",
    "price": 14,
    "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629711/products/nynojkka9vjljvh1vlbo.jpg",
    "quantity": 20,
    "condition": "new",
    "category": {
      "_id": "65b91a0f381e43aa9659bef6",
      "name": "RAM",
      "createdAt": "2024-01-30T15:47:27.448Z",
      "updatedAt": "2024-01-30T15:47:27.448Z",
      "__v": 0
    },
    "brand": {
      "_id": "65b91a62381e43aa9659bf07",
      "name": "Apacer",
      "createdAt": "2024-01-30T15:48:50.272Z",
      "updatedAt": "2024-01-30T15:48:50.272Z",
      "__v": 0
    },
    "compatibility": ["windows", "linux"],
    "interface": ["sata"],
    "capacity": "4GB",
    "isDeleted": false,
    "__v": 0
  }
}
```

### 7. Update Product

- Endpoint: **PUT /api/products/:id**
- Request body: Contain product data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/products/658d8e097f294aebc4e02497`
- Example request body:

```json
{
  "quantity": 120,
  "condition": "used"
}
```

#### Example response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product updated successfully",
  "data": {
    "_id": "65b91a77381e43aa9659bf0c",
    "name": "Apacer Panther Golden 4GB DDR4 2666MHZ Desktop RAM",
    "price": 120,
    "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629711/products/nynojkka9vjljvh1vlbo.jpg",
    "quantity": 100,
    "condition": "used",
    "category": "65b91a0f381e43aa9659bef6",
    "brand": "65b91a62381e43aa9659bf07",
    "compatibility": ["windows", "linux"],
    "interface": ["sata", "htmi"],
    "capacity": "4GB",
    "isDeleted": false,
    "__v": 0
  }
}
```

### 8. Delete Single Product

- Endpoint: **DELETE /api/products/:id**
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/products/658d8e097f294aebc4e02497`

### 9. Delete Multiple Product

- Endpoint: **PUT /api/products/delete**
- Request body: Contain product data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/products/delete`
- Example Request Body:

```javascript
  {"ids": ["658d8e097f294aebc4e02497", "65t3klgjf7f294aebc4e02497", "5938f97f294aebc4e02497"]}
```

## Order API Endpoints

### 10. Create Order

- Endpoint: **POST /api/orders/create**
- Request body: Contain order data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/orders/create`
- Example Request Body:

```json
{
  "productId": "65b673baa9bff384fab61ee0",
  "orderBy": "Misbahur Rahman",
  "quantity": 10,
  "orderAt": "Mon Jan 29 2024 23: 20: 46 GMT+0600 (Bangladesh Standard Time)"
}
```

#### Example response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": [
    {
      "productId": "65b91a34381e43aa9659bf00",
      "orderBy": "Misbahur Rahman",
      "quantity": 10,
      "orderAt": "Mon Jan 29 2024 23: 20: 46 GMT+0600 (Bangladesh Standard Time)",
      "_id": "65b91fc126dde92198f98148",
      "createdAt": "2024-01-30T16:11:45.651Z",
      "updatedAt": "2024-01-30T16:11:45.651Z",
      "__v": 0
    }
  ]
}
```

### 11. Order History with Range

- Endpoint: **GET /api/orders/history**
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/orders/history?dateRange=weekly`

#### Example response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order history fetched successfully",
  "data": {
    "page": 1,
    "limit": 5,
    "skip": 0,
    "totalProduct": 2,
    "totalOrder": 4,
    "totalRevenue": 1674,
    "orders": [
      {
        "_id": "65b91fc126dde92198f98148",
        "productId": "65b91a34381e43aa9659bf00",
        "orderBy": "Misbahur Rahman",
        "quantity": 10,
        "orderAt": "Mon Jan 29 2024 23: 20: 46 GMT+0600 (Bangladesh Standard Time)",
        "createdAt": "2024-01-30T16:11:45.651Z",
        "updatedAt": "2024-01-30T16:11:45.651Z",
        "__v": 0,
        "products": {
          "_id": "65b91a34381e43aa9659bf00",
          "name": "TEAM DELTA UD 4GB 2666MHz RGB DDR4 Desktop RAM",
          "price": 22,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629613/products/hrjsf2tmsefkxvi35s9u.jpg",
          "quantity": 83,
          "condition": "new",
          "category": "65b91a0f381e43aa9659bef6",
          "brand": "65b91a1d381e43aa9659befb",
          "compatibility": ["windows", "linux"],
          "interface": ["sata"],
          "capacity": "4GB",
          "isDeleted": false,
          "__v": 0
        },
        "totalPrice": 220
      },
      {
        "_id": "65b91b6e652db14c433a71b1",
        "productId": "65b91acf381e43aa9659bf1d",
        "orderBy": "Amir Hamza",
        "quantity": 20,
        "orderAt": "2024-01-29T18:00:00.000Z",
        "createdAt": "2024-01-30T15:53:18.744Z",
        "updatedAt": "2024-01-30T15:53:18.744Z",
        "__v": 0,
        "products": {
          "_id": "65b91acf381e43aa9659bf1d",
          "name": "GIGABYTE GeForce GT 710 2GB Graphics Card",
          "price": 65,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629775/products/nky4pmm5iyj85z9vsup5.webp",
          "quantity": 0,
          "condition": "new",
          "category": "65b91aa4381e43aa9659bf13",
          "brand": "65b91aae381e43aa9659bf18",
          "compatibility": ["windows", "linux"],
          "interface": ["sata", "displayport", "hdmi"],
          "capacity": "2GB",
          "isDeleted": true,
          "__v": 0,
          "deletedAt": "2024-01-30T15:53:19.126Z"
        },
        "totalPrice": 1300
      },
      {
        "_id": "65b91b46652db14c433a71a9",
        "productId": "65b91a34381e43aa9659bf00",
        "orderBy": "Emon Mia",
        "quantity": 2,
        "orderAt": "2024-01-28T18:00:00.000Z",
        "createdAt": "2024-01-30T15:52:38.401Z",
        "updatedAt": "2024-01-30T15:52:38.401Z",
        "__v": 0,
        "products": {
          "_id": "65b91a34381e43aa9659bf00",
          "name": "TEAM DELTA UD 4GB 2666MHz RGB DDR4 Desktop RAM",
          "price": 22,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629613/products/hrjsf2tmsefkxvi35s9u.jpg",
          "quantity": 83,
          "condition": "new",
          "category": "65b91a0f381e43aa9659bef6",
          "brand": "65b91a1d381e43aa9659befb",
          "compatibility": ["windows", "linux"],
          "interface": ["sata"],
          "capacity": "4GB",
          "isDeleted": false,
          "__v": 0
        },
        "totalPrice": 44
      },
      {
        "_id": "65b91b34652db14c433a71a1",
        "productId": "65b91a34381e43aa9659bf00",
        "orderBy": "Kaled Ahmed",
        "quantity": 5,
        "orderAt": "2024-01-19T18:00:00.000Z",
        "createdAt": "2024-01-30T15:52:20.524Z",
        "updatedAt": "2024-01-30T15:52:20.524Z",
        "__v": 0,
        "products": {
          "_id": "65b91a34381e43aa9659bf00",
          "name": "TEAM DELTA UD 4GB 2666MHz RGB DDR4 Desktop RAM",
          "price": 22,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629613/products/hrjsf2tmsefkxvi35s9u.jpg",
          "quantity": 83,
          "condition": "new",
          "category": "65b91a0f381e43aa9659bef6",
          "brand": "65b91a1d381e43aa9659befb",
          "compatibility": ["windows", "linux"],
          "interface": ["sata"],
          "capacity": "4GB",
          "isDeleted": false,
          "__v": 0
        },
        "totalPrice": 110
      }
    ]
  }
}
```

### 12. Get Top Selling Products:

- Endpoint: **GET /api/orders/top-products**
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/orders/top-products`

#### Example response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order history fetched successfully",
  "data": {
    "page": 1,
    "limit": 5,
    "skip": 0,
    "totalProduct": 2,
    "totalOrder": 4,
    "totalRevenue": 1674,
    "orders": [
      {
        "_id": "65b91fc126dde92198f98148",
        "productId": "65b91a34381e43aa9659bf00",
        "orderBy": "Misbahur Rahman",
        "quantity": 10,
        "orderAt": "Mon Jan 29 2024 23: 20: 46 GMT+0600 (Bangladesh Standard Time)",
        "createdAt": "2024-01-30T16:11:45.651Z",
        "updatedAt": "2024-01-30T16:11:45.651Z",
        "__v": 0,
        "products": {
          "_id": "65b91a34381e43aa9659bf00",
          "name": "TEAM DELTA UD 4GB 2666MHz RGB DDR4 Desktop RAM",
          "price": 22,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629613/products/hrjsf2tmsefkxvi35s9u.jpg",
          "quantity": 83,
          "condition": "new",
          "category": "65b91a0f381e43aa9659bef6",
          "brand": "65b91a1d381e43aa9659befb",
          "compatibility": ["windows", "linux"],
          "interface": ["sata"],
          "capacity": "4GB",
          "isDeleted": false,
          "__v": 0
        },
        "totalPrice": 220
      },
      {
        "_id": "65b91b6e652db14c433a71b1",
        "productId": "65b91acf381e43aa9659bf1d",
        "orderBy": "Amir Hamza",
        "quantity": 20,
        "orderAt": "2024-01-29T18:00:00.000Z",
        "createdAt": "2024-01-30T15:53:18.744Z",
        "updatedAt": "2024-01-30T15:53:18.744Z",
        "__v": 0,
        "products": {
          "_id": "65b91acf381e43aa9659bf1d",
          "name": "GIGABYTE GeForce GT 710 2GB Graphics Card",
          "price": 65,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629775/products/nky4pmm5iyj85z9vsup5.webp",
          "quantity": 0,
          "condition": "new",
          "category": "65b91aa4381e43aa9659bf13",
          "brand": "65b91aae381e43aa9659bf18",
          "compatibility": ["windows", "linux"],
          "interface": ["sata", "displayport", "hdmi"],
          "capacity": "2GB",
          "isDeleted": true,
          "__v": 0,
          "deletedAt": "2024-01-30T15:53:19.126Z"
        },
        "totalPrice": 1300
      },
      {
        "_id": "65b91b46652db14c433a71a9",
        "productId": "65b91a34381e43aa9659bf00",
        "orderBy": "Emon Mia",
        "quantity": 2,
        "orderAt": "2024-01-28T18:00:00.000Z",
        "createdAt": "2024-01-30T15:52:38.401Z",
        "updatedAt": "2024-01-30T15:52:38.401Z",
        "__v": 0,
        "products": {
          "_id": "65b91a34381e43aa9659bf00",
          "name": "TEAM DELTA UD 4GB 2666MHz RGB DDR4 Desktop RAM",
          "price": 22,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629613/products/hrjsf2tmsefkxvi35s9u.jpg",
          "quantity": 83,
          "condition": "new",
          "category": "65b91a0f381e43aa9659bef6",
          "brand": "65b91a1d381e43aa9659befb",
          "compatibility": ["windows", "linux"],
          "interface": ["sata"],
          "capacity": "4GB",
          "isDeleted": false,
          "__v": 0
        },
        "totalPrice": 44
      },
      {
        "_id": "65b91b34652db14c433a71a1",
        "productId": "65b91a34381e43aa9659bf00",
        "orderBy": "Kaled Ahmed",
        "quantity": 5,
        "orderAt": "2024-01-19T18:00:00.000Z",
        "createdAt": "2024-01-30T15:52:20.524Z",
        "updatedAt": "2024-01-30T15:52:20.524Z",
        "__v": 0,
        "products": {
          "_id": "65b91a34381e43aa9659bf00",
          "name": "TEAM DELTA UD 4GB 2666MHz RGB DDR4 Desktop RAM",
          "price": 22,
          "image": "https://res.cloudinary.com/djkhvobdo/image/upload/v1706629613/products/hrjsf2tmsefkxvi35s9u.jpg",
          "quantity": 83,
          "condition": "new",
          "category": "65b91a0f381e43aa9659bef6",
          "brand": "65b91a1d381e43aa9659befb",
          "compatibility": ["windows", "linux"],
          "interface": ["sata"],
          "capacity": "4GB",
          "isDeleted": false,
          "__v": 0
        },
        "totalPrice": 110
      }
    ]
  }
}
```

## Others API Endpoints

### 13. Create Category

- Endpoint: **POST /api/categories/create**
- Request body: Contain category data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/categories/create`
- Example request body:

```json
{
  "name": "Graphic Card"
}
```

#### Example response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "name": "Graphic Card",
    "_id": "65b91e9326dde92198f9813d",
    "createdAt": "2024-01-30T16:06:43.971Z",
    "updatedAt": "2024-01-30T16:06:43.971Z",
    "__v": 0
  }
}
```

### 14. Get Categories

- Endpoint: **GET /api/categories**
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/categories`

#### Example response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category fetched successfully",
  "data": [
    {
      "_id": "65b91a0f381e43aa9659bef6",
      "name": "RAM",
      "createdAt": "2024-01-30T15:47:27.448Z",
      "updatedAt": "2024-01-30T15:47:27.448Z",
      "__v": 0
    },
    {
      "_id": "65b91aa4381e43aa9659bf13",
      "name": "Graphics Card",
      "createdAt": "2024-01-30T15:49:56.316Z",
      "updatedAt": "2024-01-30T15:49:56.316Z",
      "__v": 0
    },
    {
      "_id": "65b91e9326dde92198f9813d",
      "name": "Graphic Card",
      "createdAt": "2024-01-30T16:06:43.971Z",
      "updatedAt": "2024-01-30T16:06:43.971Z",
      "__v": 0
    }
  ]
}
```

### 15. Create Brand

- Endpoint: **POST /api/brands/create**
- Request body: Contain brand data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/brands/create`
- Example request body:

```json
{
  "name": "Apple"
}
```

#### Example response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Brand created successfully",
  "data": {
    "name": "Apple",
    "_id": "65b91f0126dde92198f98142",
    "createdAt": "2024-01-30T16:08:33.231Z",
    "updatedAt": "2024-01-30T16:08:33.231Z",
    "__v": 0
  }
}
```

### 16. Create Brands

- Endpoint: **GET /api/brands**
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/brands`

#### Example response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Brand fetched successfully",
  "data": [
    {
      "_id": "65b91a1d381e43aa9659befb",
      "name": "Team",
      "createdAt": "2024-01-30T15:47:41.373Z",
      "updatedAt": "2024-01-30T15:47:41.373Z",
      "__v": 0
    },
    {
      "_id": "65b91a62381e43aa9659bf07",
      "name": "Apacer",
      "createdAt": "2024-01-30T15:48:50.272Z",
      "updatedAt": "2024-01-30T15:48:50.272Z",
      "__v": 0
    },
    {
      "_id": "65b91aae381e43aa9659bf18",
      "name": "Gigabyte",
      "createdAt": "2024-01-30T15:50:06.626Z",
      "updatedAt": "2024-01-30T15:50:06.626Z",
      "__v": 0
    },
    {
      "_id": "65b91f0126dde92198f98142",
      "name": "Apple",
      "createdAt": "2024-01-30T16:08:33.231Z",
      "updatedAt": "2024-01-30T16:08:33.231Z",
      "__v": 0
    }
  ]
}
```
