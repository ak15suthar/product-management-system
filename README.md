# Product Management System

A production-ready full-stack Product Management System built with Angular, Node.js, Express, and PostgreSQL.

## Architecture

The application follows a clean architecture pattern with clear separation of concerns:

```
backend/
├── src/
│   ├── config/          # Environment configuration
│   ├── controllers/     # Request handlers
│   ├── routes/          # API route definitions
│   ├── middleware/       # Auth, error handling, uploads
│   ├── services/        # Business logic
│   ├── repositories/    # Database access layer
│   ├── validators/      # Input validation (Zod)
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript interfaces
│   └── constants/       # Application constants
├── prisma/              # Database schema and migrations
└── uploads/             # Uploaded files

frontend/
├── src/app/
│   ├── auth/            # Login/Register
│   ├── dashboard/       # Dashboard view
│   ├── users/           # User management
│   ├── categories/      # Category management
│   ├── products/        # Product management
│   ├── bulk-upload/     # CSV bulk upload
│   ├── reports/         # Export functionality
│   ├── shared/          # Services, components
│   ├── guards/          # Route guards
│   ├── interceptors/    # HTTP interceptors
│   └── models/          # TypeScript interfaces
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **File Upload**: Multer
- **CSV Parsing**: csv-parser
- **Excel Export**: ExcelJS
- **API Docs**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: Angular 20+
- **Language**: TypeScript
- **UI Library**: Angular Material
- **Forms**: Reactive Forms
- **State**: Angular Signals + RxJS
- **HTTP**: Angular HttpClient

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Configure database connection in .env
# DATABASE_URL="postgresql://user:password@localhost:5432/product_management"

# Run Prisma migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | JWT signing secret | default-secret-key |
| JWT_EXPIRES_IN | Token expiration | 24h |
| CORS_ORIGIN | Frontend URL | http://localhost:4200 |
| UPLOAD_DIR | Upload directory | src/uploads |
| EXPORT_DIR | Export directory | src/exports |
| MAX_FILE_SIZE | Max upload size (bytes) | 5242880 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Database Schema

### User
- id (Int, PK, auto-increment)
- uuid (String, unique)
- email (String, unique)
- password (String, hashed)
- name (String, optional)
- role (String, default: "user")
- createdAt, updatedAt

### Category
- id (Int, PK, auto-increment)
- uuid (String, unique)
- name (String, unique)
- createdAt, updatedAt

### Product
- id (Int, PK, auto-increment)
- uuid (String, unique)
- name (String)
- image (String, optional)
- price (Float)
- categoryId (Int, FK)
- createdAt, updatedAt

## Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server validates credentials and returns JWT token
3. Token stored in localStorage on frontend
4. HTTP interceptor attaches token to all requests
5. Server validates token on protected routes
6. Route guards prevent unauthorized access

## API Documentation

Swagger documentation is available at `http://localhost:3000/api-docs` when the server is running.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/dashboard | Dashboard stats |
| CRUD | /api/users | User management |
| CRUD | /api/categories | Category management |
| CRUD | /api/products | Product management |
| POST | /api/products/bulk-upload | Bulk CSV upload |
| GET | /api/products/export/csv | Export as CSV |
| GET | /api/products/export/xlsx | Export as XLSX |

## Pagination, Sorting, Searching

### Product List Query Parameters
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `sortBy` (string): Sort field (name, price, createdAt)
- `sortOrder` (string): asc or desc
- `search` (string): Search by product or category name
- `categoryId` (string): Filter by category UUID

### Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalRecords": 100,
    "totalPages": 5
  }
}
```

## Bulk Upload Strategy

1. CSV file uploaded via multipart form
2. File validated for CSV format
3. Stream parsing with csv-parser (memory efficient)
4. Each row validated for required fields
5. Invalid rows skipped with error tracking
6. Categories auto-created if not exists
7. Products inserted in batches
8. Response includes success/failure counts and error details

## Report Generation Strategy

- **CSV**: Generated using ExcelJS streaming
- **XLSX**: Generated using ExcelJS
- Includes: Product Name, Category, Price, UUID, Created Date
- Streams response for memory efficiency

## Security

- **Helmet**: HTTP security headers
- **CORS**: Configurable origin
- **Rate Limiting**: 100 requests per 15 minutes
- **JWT**: Secure token authentication
- **bcrypt**: Password hashing (12 rounds)
- **Input Validation**: Zod schemas
- **SQL Injection**: Prevented by Prisma ORM

## Postman Collection

Import `postman/Product-Management-System.postman_collection.json` into Postman.

Set the `baseUrl` variable to `http://localhost:3000/api`.
After login, the token is automatically saved to the `token` variable.

## Trade-offs

1. **Prisma over raw SQL**: More maintainable but adds abstraction overhead
2. **JWT over sessions**: Stateless but no server-side revocation
3. **Zod over Joi**: Better TypeScript integration
4. **ExcelJS for exports**: Streaming support but heavier than csv-writer
5. **Angular Material**: Full-UI framework vs custom components

## Future Improvements

- Redis caching for frequently accessed data
- Soft delete with audit logs
- Docker containerization
- CI/CD with GitHub Actions
- Cloudinary for image uploads
- Unit and integration tests
- Real-time updates with WebSocket
- Role-based access control (RBAC)
- API versioning

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Seed database: `npx prisma db seed`
5. Build backend: `npm run build`
6. Build frontend: `ng build`
7. Serve frontend from backend or CDN

### Docker (Coming Soon)
```bash
docker-compose up -d
```
