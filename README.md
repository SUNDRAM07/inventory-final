# Inventory Management Tool

A RESTful API backend for managing inventory for small businesses. Built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication system
- **Product Management**: Add, update, and retrieve products
- **Inventory Tracking**: Real-time quantity updates
- **RESTful API**: Clean, documented API endpoints
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Docker Support**: Containerized application
- **OpenAPI Documentation**: Auto-generated Swagger docs
- **React Frontend**: Modern admin portal with analytics
- **Real-time Analytics**: Charts and insights with Chart.js

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React 18 with hooks
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Charts**: Chart.js with react-chartjs-2
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   - Frontend Admin Portal: http://localhost:3000
   - API Base URL: http://localhost:8080
   - Swagger Documentation: http://localhost:8080/docs
   - ReDoc Documentation: http://localhost:8080/redoc

### Local Development

1. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database and user
   createdb inventory_db
   ```

4. **Run the application**
   ```bash
   uvicorn app.main:app --reload --port 8080
   ```

## API Endpoints

### Authentication

#### Register User
```http
POST /register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### Products (Authentication Required)

#### Add Product
```http
POST /products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "type": "Electronics",
  "sku": "IPH-15-001",
  "image_url": "https://example.com/iphone15.jpg",
  "description": "Latest iPhone model",
  "quantity": 10,
  "price": 999.99
}
```

#### Update Product Quantity
```http
PUT /products/{product_id}/quantity
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "quantity": 15
}
```

#### Get Products
```http
GET /products?skip=0&limit=100
Authorization: Bearer <access_token>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    sku VARCHAR UNIQUE NOT NULL,
    image_url VARCHAR,
    description TEXT,
    quantity INTEGER DEFAULT 0 NOT NULL,
    price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Testing

### Using the Test Script

1. **Install Python dependencies**
   ```bash
   pip install requests
   ```

2. **Update the test script**
   - Open `test_api.py`
   - Update `BASE_URL` to point to your server (default: http://localhost:8080)

3. **Run the tests**
   ```bash
   python test_api.py
   ```

### Manual Testing with curl

1. **Register a user**
   ```bash
   curl -X POST "http://localhost:8080/register" \
        -H "Content-Type: application/json" \
        -d '{"username": "testuser", "password": "testpass"}'
   ```

2. **Login and get token**
   ```bash
   curl -X POST "http://localhost:8080/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "testuser", "password": "testpass"}'
   ```

3. **Add a product**
   ```bash
   curl -X POST "http://localhost:8080/products" \
        -H "Authorization: Bearer YOUR_TOKEN_HERE" \
        -H "Content-Type: application/json" \
        -d '{
          "name": "Test Product",
          "type": "Test",
          "sku": "TEST-001",
          "quantity": 5,
          "price": 29.99
        }'
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/inventory_db` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-in-production` |
| `PORT` | Server port | `8080` |

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with expiration
- **Input Validation**: Pydantic models for request validation
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **CORS Support**: Configurable cross-origin resource sharing

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation errors

## Development

### Project Structure
```
inventory/
├── app/                    # Backend application
│   ├── __init__.py
│   ├── main.py            # FastAPI application
│   ├── database.py        # Database configuration
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Authentication utilities
│   └── crud.py            # Database operations
├── frontend/              # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   ├── package.json       # Frontend dependencies
│   └── Dockerfile         # Frontend Docker config
├── requirements.txt       # Python dependencies
├── Dockerfile            # Backend Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── env.example           # Environment variables template
├── database_init.sql     # Database initialization script
├── test_api.py           # API test script
├── postman_collection.json # Postman collection
├── README.md             # Project documentation
└── PROJECT_SUMMARY.md    # Complete summary
```

### Adding New Features

1. **Database Models**: Add to `app/models.py`
2. **API Schemas**: Add to `app/schemas.py`
3. **CRUD Operations**: Add to `app/crud.py`
4. **API Endpoints**: Add to `app/main.py`

## Deployment

### Production Considerations

1. **Environment Variables**: Set proper `SECRET_KEY` and `DATABASE_URL`
2. **Database**: Use managed PostgreSQL service
3. **SSL/TLS**: Configure HTTPS
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Add health checks and logging
6. **Backup**: Set up database backups

### Docker Deployment

```bash
# Build and run in production
docker build -t inventory-app .
docker run -p 8080:8080 \
  -e DATABASE_URL=your_production_db_url \
  -e SECRET_KEY=your_production_secret \
  inventory-app
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 