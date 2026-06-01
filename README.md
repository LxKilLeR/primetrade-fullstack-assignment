# Internship Assignment Project

A production-ready internship assignment project with a Node.js/Express backend, MongoDB/Mongoose data layer, JWT authentication, role-based access control, and a React/Vite frontend dashboard.

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    validations/
    app.js
  server.js
  .env.example
  package.json
frontend/
  src/
    components/
    context/
    pages/
    services/
    App.jsx
  index.html
  vite.config.js
  .env.example
  package.json
```

## Features

- User registration and login
- JWT authentication with expiration
- Password hashing with bcryptjs
- Protected profile route
- Role-based access control for `user` and `admin`
- Task CRUD with ownership checks
- Pagination and status filtering
- Security middleware with Helmet, CORS, and rate limiting
- React dashboard with token storage, protected routes, and task management

## Backend Setup

1. Move into the backend folder.
2. Copy `.env.example` to `.env` and fill in real values.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.

### Environment Variables

- `PORT` - backend port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign tokens
- `JWT_EXPIRES_IN` - token lifetime, for example `7d`
- `CLIENT_URL` - frontend origin for CORS, for example `http://localhost:5173`
- `NODE_ENV` - environment name

## Frontend Setup

1. Move into the frontend folder.
2. Copy `.env.example` to `.env` and set the API base URL.
3. Install dependencies with `npm install`.
4. Start the dev server with `npm run dev`.

### Environment Variables

- `VITE_API_BASE_URL` - backend API URL, for example `http://localhost:5000/api/v1`

## API Routes

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/profile`

### Tasks

- `POST /api/v1/tasks`
- `GET /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PUT /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

### Query Params for Tasks

- `page` - pagination page number
- `limit` - number of records per page
- `status` - filter by `pending`, `in-progress`, or `completed`

## API Testing Examples

### Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

### Postman Examples

#### Register User

`POST http://localhost:5000/api/v1/auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

#### Login

`POST http://localhost:5000/api/v1/auth/login`

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

### Create Task

```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Prepare report","description":"Draft weekly report","status":"pending"}'
```

### List Tasks

```bash
curl "http://localhost:5000/api/v1/tasks?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Deployment

### Render Backend

- Use the backend folder as the service root.
- Set build command to `npm install`.
- Set start command to `npm start`.
- Add environment variables from `backend/.env.example`.
- Point `MONGODB_URI` to MongoDB Atlas or another managed MongoDB instance.
- Set `CLIENT_URL` to the deployed frontend URL.

### Vercel Frontend

- Use the frontend folder as the project root.
- Set `VITE_API_BASE_URL` to the deployed backend API, for example `https://your-api.onrender.com/api/v1`.
- Deploy as a static Vite app.

## Scalability Notes

- The backend is split into config, controllers, middleware, models, routes, utils, and validations for maintainability.
- Authentication and authorization are separated into reusable middleware.
- Task access checks are centralized so admin and ownership rules stay consistent.
- Pagination and filtering keep list endpoints efficient as data grows.
- Error handling is centralized for consistent API responses.

## Notes

- Admin accounts should be seeded or created through a controlled internal process.
- Users can only update or delete tasks they own, while admins can access all tasks.
