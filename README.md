# Inventory Management Tool

A comprehensive inventory management system with FastAPI backend and React frontend, featuring Google OAuth authentication and real-time analytics.

## Features

- **🔐 Google OAuth Authentication**: Seamless login with Google accounts
- **👥 User Management**: Role-based access control (Admin, Manager, User)
- **📦 Product Management**: Add, update, and retrieve products with images
- **📊 Real-time Analytics**: Interactive charts and insights with Chart.js
- **🔄 Inventory Tracking**: Real-time quantity updates and low stock alerts
- **🎨 Modern UI**: Beautiful React frontend with responsive design
- **🔒 JWT Authentication**: Secure token-based authentication
- **📚 RESTful API**: Clean, documented API endpoints
- **🗄️ Database**: PostgreSQL with SQLAlchemy ORM
- **🐳 Docker Support**: Containerized application
- **📖 OpenAPI Documentation**: Auto-generated Swagger docs

## Tech Stack

### Backend
- **FastAPI** (Python) - Modern, fast web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Google OAuth** - Third-party authentication

### Frontend
- **React 18** - Modern UI library
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Toastify** - Notifications

### DevOps
- **Docker & Docker Compose** - Containerization
- **Python 3.12** - Backend runtime
- **Node.js** - Frontend runtime

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Google Cloud Console account (for OAuth)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/SUNDRAM07/inventory-final
   cd inventory
   ```

2. **Set up Google OAuth** (Optional but recommended)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/auth/callback` to authorized redirect URIs

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Google OAuth credentials
   ```

4. **Start the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the Application**
   - Frontend Admin Portal: http://localhost:3000
   - API Base URL: http://localhost:8080
   - Swagger Documentation: http://localhost:8080/docs
   - ReDoc Documentation: http://localhost:8080/redoc

### Local Development

1. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your database and Google OAuth credentials
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

4. **Run the backend**
   ```bash
   uvicorn app.main:app --reload --port 8080
   ```

5. **Run the frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Authentication

### Google OAuth (Recommended)

Users can sign in directly with their Google accounts:

1. Click "Continue with Google" on the login page
2. Authorize the application
3. Get automatically logged in with profile imported from Google

### Traditional Login

Users can also register and login with username/password:

#### Register User
```http
POST /register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password",
  "role": "user"
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
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture": "https://...",
    "auth_provider": "google"
  }
}
```

## API Endpoints

### Authentication

- `POST /register` - Register new user
- `POST /login` - Login with username/password
- `GET /auth/google/url` - Get Google OAuth URL
- `POST /auth/google` - Authenticate with Google token

### Products (Authentication Required)

- `GET /products` - Get all products
- `POST /products` - Add new product (Admin/Manager)
- `PUT /products/{id}/quantity` - Update product quantity (Admin/Manager)
- `DELETE /products/{id}` - Delete product (Admin)

### Users (Admin Only)

- `GET /users` - Get all users
- `PUT /users/{id}/role` - Update user role
- `DELETE /users/{id}` - Delete user

### Analytics

- `GET /analytics/dashboard` - Get dashboard statistics
- `GET /analytics/products` - Get product analytics

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR,
    email VARCHAR,
    google_id VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_picture VARCHAR,
    auth_provider VARCHAR DEFAULT 'local',
    role VARCHAR DEFAULT 'user',
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

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/inventory_db` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-in-production` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `GOOGLE_REDIRECT_URI` | Google OAuth redirect URI | `http://localhost:3000/auth/callback` |
| `PORT` | Server port | `8080` |

## Security Features

- **🔐 Google OAuth**: Secure third-party authentication
- **🔑 JWT Authentication**: Stateless authentication with expiration
- **🔒 Password Hashing**: bcrypt for secure password storage
- **✅ Input Validation**: Pydantic models for request validation
- **🛡️ SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **🌐 CORS Support**: Configurable cross-origin resource sharing
- **👥 Role-Based Access**: Admin, Manager, User permissions

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

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server errors

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
│   ├── google_auth.py     # Google OAuth implementation
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
5. **Frontend Components**: Add to `frontend/src/components/`

## Deployment

### Production Considerations

1. **Environment Variables**: Set proper `SECRET_KEY`, `DATABASE_URL`, and Google OAuth credentials
2. **Database**: Use managed PostgreSQL service
3. **SSL/TLS**: Configure HTTPS
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Add health checks and logging
6. **Backup**: Set up database backups
7. **Google OAuth**: Configure production redirect URIs

### Docker Deployment

```bash
# Build and run in production
docker build -t inventory-app .
docker run -p 8080:8080 \
  -e DATABASE_URL=your_production_db_url \
  -e SECRET_KEY=your_production_secret \
  -e GOOGLE_CLIENT_ID=your_google_client_id \
  -e GOOGLE_CLIENT_SECRET=your_google_client_secret \
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