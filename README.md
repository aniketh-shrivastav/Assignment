# Internship Assignment - Scalable REST API + React UI

This project implements a secure and scalable backend API with JWT authentication, role-based access control, and product CRUD using MongoDB. It also includes a basic React frontend to test all APIs.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, Zod, Swagger
- Frontend: React.js (Vite), React Router
- Database: MongoDB

## Project Structure

```text
Assignment/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/v1/
      services/
      utils/
    postman_collection.json
  frontend/
    src/
      components/
      pages/
      services/
```

## Backend Features

- User registration and login
- Password hashing using `bcryptjs`
- JWT authentication
- Role-based access (`user`, `admin`)
- Product CRUD (secondary entity)
- API versioning (`/api/v1`)
- Input validation and sanitization
- Centralized error handling
- API documentation via Swagger (`/api/docs`)

## Frontend Features

- Register and login UI
- Protected dashboard (JWT required)
- Product CRUD UI
- API success/error message display

## Database Schema (MongoDB)

### User

- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (Enum: `user` | `admin`)
- timestamps

### Product

- `title` (String, required)
- `description` (String)
- `price` (Number, required)
- `owner` (ObjectId ref `User`, required)
- timestamps

## Setup Instructions

`backend/.env` is already created in this workspace and includes a JWT secret.

## 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` by copying values from `backend/.env.example`, then edit as needed.

Start backend:

```bash
npm run dev
```

Backend default URL: `http://localhost:5000`

Swagger docs: `http://localhost:5000/api/docs`

## 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` by copying values from `frontend/.env.example`.

Frontend default URL: `http://localhost:5173`

## API Endpoints (v1)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (protected)
- `GET /api/v1/products` (protected)
- `POST /api/v1/products` (protected)
- `GET /api/v1/products/:id` (protected)
- `PUT /api/v1/products/:id` (protected)
- `DELETE /api/v1/products/:id` (protected)
- `GET /api/v1/products/admin/all` (protected, admin only)

## Postman Collection

Import `backend/postman_collection.json` into Postman.

## Security Practices Implemented

- Password hashing with bcrypt
- Signed JWT tokens with expiry
- Route-level authentication middleware
- Role-based authorization middleware
- Request validation using Zod
- Mongo query sanitization with `express-mongo-sanitize`
- HTTP security headers with Helmet

## Scalability Note

The project follows a modular architecture (`controllers`, `routes`, `services`, `middleware`, `models`) so new modules can be added without impacting existing logic.

For production scalability:

- Deploy backend replicas behind a load balancer
- Use Redis for caching hot reads and token blacklisting
- Add async processing with queues for heavy jobs
- Move toward microservices if domain complexity grows
- Add centralized logging/monitoring (ELK, Grafana, or cloud-native tools)

## Optional Improvements

- Rate limiting and refresh token flow
- Automated tests (unit + integration)
- CI/CD pipeline for build/test/deploy
