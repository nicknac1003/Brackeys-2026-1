# Express + PostgreSQL + JWT Boilerplate

A basic Express server with PostgreSQL database and JWT authentication.

## Features

- Express.js server
- PostgreSQL database integration
- JWT authentication
- User registration and login
- Protected routes
- Password hashing with bcrypt
- Environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your PostgreSQL credentials

3. Set up the database:
   - Create a PostgreSQL database
   - Run the schema file to create tables:
```bash
psql -U postgres -d mydatabase -f config/schema.sql
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Users (Protected Routes)

- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/me` - Get current user profile (requires authentication)

### Authentication Header

For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Project Structure

```
.
├── config/
│   ├── database.js      # Database configuration
│   └── schema.sql       # Database schema
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   └── users.js         # User routes
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
├── server.js            # Main server file
└── README.md            # This file
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRES_IN` - JWT expiration time (e.g., 24h, 7d)

## Security Notes

- Change the `JWT_SECRET` in production to a strong, random string
- Use HTTPS in production
- Implement rate limiting for authentication endpoints
- Add input validation and sanitization
- Keep dependencies up to date

## License

ISC
