# Todo App

A full-stack todo application with React frontend, Spring Boot backend, and PostgreSQL database.

## Quick Start

1. **Clone and setup environment**

   ```bash
   git clone <repository-url>
   cd todo-app
   cp .env.example .env
   ```

2. **Configure environment**
   Edit `.env` file with your preferred settings:

   ```env
   # Database
   POSTGRES_USER=todouser
   POSTGRES_PASSWORD=todopass
   POSTGRES_DB=todo_app

   # Spring Boot datasource
   SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/todo_app
   SPRING_DATASOURCE_USERNAME=todouser
   SPRING_DATASOURCE_PASSWORD=todopass

   # JWT Secret (use a strong secret in production)
   JWT_SECRET=your_strong_jwt_secret_here_minimum_32_chars
   ```

3. **Run with Docker**

   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## Features

- User registration and authentication
- JWT-based secure authentication
- Create, view, and complete tasks

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}/complete` - Complete task
