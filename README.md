# mpos_api

API server to support the Mobile Point of Sale (MPOS) application.

Built with Node.js, Express, and MongoDB. This application handles user authentication, product and inventory management, sales transactions, sales returns and comprehensive reporting.

---

## **Table of Contents**

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**

- **Docker Support**
  - Docker configuration for easy deployment.

---

## **Prerequisites**

- **Node.js** (version 14.x or higher)
- **npm** (version 6.x or higher)
- **MongoDB** (version 4.x or higher)
- **Git** (for cloning the repository)
- **Docker** (optional, for containerized deployment)

---

## **Installation**

1. **Clone the Repository**

   ```bash
   git clone <repo_url>
   cd mpos_api_server
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

---

## **Environment Variables**

Create a `.env` file in the root directory of the project and configure the following environment variables:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mpos_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Other Configurations
NODE_ENV=development
```

---

## **Running the Application**

### **Locally**

1. **Start the Server**

   ```bash
   npm start
   ```

2. **Access the API**

   The server will run on `http://localhost:3000`.

### **Using Docker**

1. **Build the Docker Image**

   ```bash
   docker build -t mpos_api_server .
   ```

2. **Run the Docker Container**

   ```bash
   docker run -p 3000:3000 --env-file .env mpos_api_server
   ```

---

## **API Documentation**

### **Base URL**

- **Local Development:** `http://localhost:3000/api/v1`

### **Authentication**

- **Signup**

  ```http
  POST /api/v1/users/signup
  ```

- **Login**

  ```http
  POST /api/v1/users/login
  ```

### **Protected Routes**

All protected routes require an `Authorization` header with a valid JWT token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Modules and Endpoints**

#### **Users**

- **Get All Users**

  ```http
  GET /api/v1/users
  ```

- **Get User by ID**

  ```http
  GET /api/v1/users/:id
  ```

- **Update User**

  ```http
  PUT /api/v1/users/:id
  ```

- **Delete User**

  ```http
  DELETE /api/v1/users/:id
  ```

#### **Products**

- **Create Product**

  ```http
  POST /api/v1/products
  ```

- **Get All Products**

  ```http
  GET /api/v1/products
  ```

- **Get Product by ID**

  ```http
  GET /api/v1/products/:id
  ```

- **Update Product**

  ```http
  PUT /api/v1/products/:id
  ```

- **Delete Product**

  ```http
  DELETE /api/v1/products/:id
  ```

#### **Categories**

- **Create Category**

  ```http
  POST /api/v1/categories
  ```

- **Get All Categories**

  ```http
  GET /api/v1/categories
  ```

- **Update Category**

  ```http
  PUT /api/v1/categories/:id
  ```

- **Delete Category**

  ```http
  DELETE /api/v1/categories/:id
  ```

#### **Customers**

- **Create Customer**

  ```http
  POST /api/v1/customers
  ```

- **Get All Customers**

  ```http
  GET /api/v1/customers
  ```

- **Get Customer by ID**

  ```http
  GET /api/v1/customers/:id
  ```

- **Update Customer**

  ```http
  PUT /api/v1/customers/:id
  ```

- **Delete Customer**

  ```http
  DELETE /api/v1/customers/:id
  ```

#### **Sales**

- **Create Sale**

  ```http
  POST /api/v1/sales
  ```

- **Get All Sales**

  ```http
  GET /api/v1/sales
  ```

- **Get Sale by ID**

  ```http
  GET /api/v1/sales/:id
  ```

#### **Sales Returns**

- **Create Sales Return**

  ```http
  POST /api/v1/sales-returns
  ```

- **Get All Sales Returns**

  ```http
  GET /api/v1/sales-returns
  ```

- **Get Sales Return by ID**

  ```http
  GET /api/v1/sales-returns/:id
  ```

#### **Reports**

- **Sales Report**

  ```http
  GET /api/v1/reports/sales?period=monthly
  ```

- **Product Performance Report**

  ```http
  GET /api/v1/reports/products?period=monthly
  ```

- **Customer Activity Report**

  ```http
  GET /api/v1/reports/customers?period=monthly
  ```

- **Inventory Report**

  ```http
  GET /api/v1/reports/inventory
  ```

- **Sales Return Report**

  ```http
  GET /api/v1/reports/sales-returns?period=monthly
  ```

- **Custom Report**

  ```http
  GET /api/v1/reports/custom?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  ```

- **Export Report**

  ```http
  GET /api/v1/reports/export?type=sales&period=monthly&format=excel
  ```

**Note:** Replace `YYYY-MM-DD` with the desired dates and `format` with `excel`, `pdf`, or `csv`.

---

## **Project Structure**

```
mpos_api_server/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── tests/
├── .env
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

- **controllers/**: Handles incoming requests and responses.
- **middleware/**: Contains authentication and authorization middleware.
- **models/**: Mongoose schemas and models.
- **routes/**: API route definitions.
- **services/**: Business logic and data manipulation.
- **utils/**: Utility functions and helpers.
- **app.js**: Express app configuration.
- **tests/**: Test cases for the application.

---

## **Contributing**

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

   Click the "Fork" button at the top right of this page to create a copy of the repository in your account.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/yourusername/mpos_api_server.git
   cd mpos_api_server
   ```

3. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**

   Implement your feature or bug fix.

5. **Commit Changes**

   ```bash
   git commit -am "Add new feature"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

   Go to the original repository and click "New Pull Request".

---

## **Acknowledgments**

- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: A general-purpose, document-based, distributed database.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT**: JSON Web Tokens for secure authentication.
- **Docker**: Containerization platform.

---

### **API Testing with Postman**

A comprehensive Postman collection is available for testing all API endpoints. Import the `mpos_api_server.postman_collection.json` file into Postman to get started.

### **Error Handling**

All API responses follow a consistent format for success and error messages, aiding in frontend integration and debugging.

### **Security Considerations**

- **Input Validation**: All inputs has to be validated using libraries like **Joi** to prevent injection attacks.
- **Rate Limiting**: Implemented to prevent brute-force attacks.
- **Helmet**: Used to set secure HTTP headers.
- **CORS**: Configured to allow requests from trusted origins.

# for testing ticket linking fn's in azure