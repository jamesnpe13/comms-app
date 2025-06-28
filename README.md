# Comms-App

A real-time messaging web application built with React, Express, and MySQL, leveraging Socket.IO for instant communication and JWT for secure authentication.

## Architecture Overview

- **Frontend**:

  - Built with React, structured as a single-page application (SPA).
  - Uses React Router for client-side routing.
  - Communicates with backend via REST APIs for user management and uses Socket.IO for real-time message delivery.

- **Backend**:

  - Built on Express.js, providing RESTful API endpoints for authentication, user management, and message handling.
  - Real-time communication powered by Socket.IO server integrated with Express.
  - JWT (JSON Web Tokens) used for stateless, secure authentication and authorization.
  - MySQL database stores user data, chat rooms, message histories, and session info.

- **Real-time Messaging**:
  - Socket.IO manages persistent WebSocket connections for instant message delivery and presence updates.
  - Supports multiple chat rooms and private direct messaging.

## Technical Highlights

- **Authentication & Security**:

  - JWT-based auth with access and refresh tokens.
  - Passwords hashed securely using bcrypt.
  - Protected routes with role-based access control (optional for admin/users).

- **Database Schema**:

  - Normalized tables for users, messages, chat rooms, and memberships.
  - Efficient indexing to optimize message querying by room and timestamp.

- **Scalability Plans**:

  - Backend stateless design enables horizontal scaling behind load balancers.
  - Future support for Electron desktop app and React Native/Flutter mobile apps sharing same backend APIs.
  - Deployment split: frontend on Vercel (CDN, static hosting), backend on Railway (managed node environment).

- **Development Workflow**:
  - Nodemon for automatic server reload during development.
  - Separate npm scripts for client (`npm run client`) and server (`npm run server`).
  - Environment variables used to configure DB credentials, JWT secrets, and API URLs.

### Environment Variables

Create a `.env` file in the `server/` directory using the following template:

| Variable                 | Description                               | Example Value           |
| ------------------------ | ----------------------------------------- | ----------------------- |
| SERVER_PORT              | Port on which the backend server runs     | `3000`                  |
| CLIENT_URL               | Allowed origin for CORS                   | `http://localhost:3000` |
| ACCESS_TOKEN_SECRET      | Secret key for signing JWT access tokens  | `'f9cd5529b8...'`       |
| REFRESH_TOKEN_SECRET     | Secret key for signing JWT refresh tokens | `'0b2df9db7...'`        |
| ACCESS_TOKEN_EXPIRES_IN  | Lifespan of access tokens                 | `15m`                   |
| REFRESH_TOKEN_EXPIRES_IN | Lifespan of refresh tokens                | `7d`                    |
| DB_HOST                  | Database host                             | `'localhost'`           |
| DB_PATH                  | Database name                             | `'[dbname]'`            |
| DB_USER                  | Database username                         | `'root'`                |
| DB_PASSWORD              | Database password                         | `'[password]'`          |
