# E-commerce Campaign Reporting API with JWT Authentication

## Task Overview:
This project implements an API for managing e-commerce campaign reporting. The task is divided into five parts, including file upload, JWT-based authentication, CRUD operations for users, and reporting APIs for campaign performance. It also includes optional enhancements like pagination, search, filtering, unit testing, and security.

## Technologies Used:
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **SQLite**: Relational database used for storing product and user data.
- **bcrypt**: Library for hashing and comparing passwords securely.
- **jsonwebtoken (JWT)**: Library for implementing token-based authentication.
- **csv-parser**: Library for parsing CSV files.
- **Jest/Mocha**: Libraries for writing unit tests (optional).
- **Helmet**: Middleware for setting HTTP headers to secure the API (optional).

---

## Features:

### 1. **CSV File Upload** (Part 1):
Users can upload a CSV file containing product campaign data, which is then stored in the SQLite database.

- **Endpoint**: `POST /upload-csv`
- **CSV Fields**:
  - Campaign Name
  - Ad Group ID
  - FSN ID
  - Product Name
  - Ad Spend
  - Views
  - Clicks
  - Direct Revenue
  - Indirect Revenue
  - Direct Units
  - Indirect Units
- **SQLite Table**: `products`

### 2. **CRUD Operations for User Management** (Part 2):
Create, Read, Update, and Delete (CRUD) operations for managing users, with hashed passwords for security.

- **Endpoints**:
  - `POST /users`: Create a new user.
  - `GET /users/:id`: Get user details by ID.
  - `PUT /users/:id`: Update user details.
  - `DELETE /users/:id`: Delete a user.

### 3. **JWT-based Authentication** (Part 3):
Secure the API using JWT authentication. Users must log in to receive a token that must be included in all subsequent requests.

- **Endpoint**:
  - `POST /login`: Generate a JWT token upon successful login.

### 4. **Product Reporting APIs** (Part 4):
Generate reports on campaign performance with various filters like Campaign Name, Ad Group ID, FSN ID, and Product Name. 

- **Endpoints**:
  - `POST /products/report/campaign`: Retrieve product statistics filtered by Campaign Name.
  - `POST /products/report/adGroupID`: Retrieve product statistics filtered by Ad Group ID.
  - `POST /products/report/fsnID`: Retrieve product statistics filtered by FSN ID.
  - `POST /products/report/productName`: Retrieve product statistics filtered by Product Name.

- **Response Fields**:
  - Ad Spend
  - Views
  - Clicks
  - CTR%: `(Clicks / Views) * 100`
  - Total Revenue: `(Direct Revenue + Indirect Revenue)`
  - Total Orders: `(Direct Units + Indirect Units)`
  - ROAS: `(Total Revenue / Ad Spend)`

### 5. **Optional Enhancements** (Part 5):
- **Pagination**: Retrieve large sets of products or reports in paginated form.
- **Search/Filter**: Add search or filter options in report APIs based on Campaign Name, Product Name, etc.
- **Unit Testing**: Write unit tests for key endpoints using Jest or Mocha.
- **Error Handling**: Properly handle missing fields, invalid data, or database errors.
- **Security**: Use `helmet`, sanitize inputs, and ensure secure authentication token handling.

---

## Project Setup:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
