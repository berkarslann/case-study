# User Management System

The **User Management System** is a full-stack application built using React for the frontend and NestJS for the backend. It provides basic user management functionalities such as listing, searching, editing, and adding users. 

## Features

- **Frontend (React)**: User interface for interacting with the system. It includes features like data display in tables, search functionality, and modals for adding or updating users.
- **Backend (NestJS)**: Manages the application logic, API endpoints, and database interactions. 
- **MySQL Database**: Stores user data securely and supports all CRUD operations.

## API Endpoints

| Method | Endpoint        | Description                                                             | Query Parameters             | Request Body                                                                                                     |
| ------ | --------------- | ----------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| GET    | `/users`        | Retrieves all users with pagination and optional search                 | `page`, `pageSize`, `search` | N/A                                                                                                              |
| GET    | `/users/:id`    | Retrieves the user information for the given user ID                    | N/A                          | N/A                                                                                                              |
| POST   | `/users/save`   | Creates a new user and saves it to the database with encrypted password | N/A                          | `{ "username": "berk", "email": "berk@example.com", "password": "password123" }`                                 |
| POST   | `/users/update` | Updates an existing user record in the database                         | N/A                          | `{ "id": "123", "username": "berk_updated", "email": "berk_updated@example.com", "password": "newpassword123" }` |

## Installation

### Option 1

1. **Clone the Repository:**

```bash
    git clone https://github.com/berkarslann/case-study.git
```

2. **To make necessary downloads for backend:**

```bash
   cd backend
   npm install
```

3. **To run backend:**

```bash
   npm start
```

4. **To make necessary downloads for frontend:** 
```bash
   cd ../frontend
   npm install
```

5. **To run frontend:**

```bash
   npm start
```

### Option 2: Run with Docker Compose

1. **Clone the Repository:**

```bash
    git clone https://github.com/berkarslann/case-study.git
```

2. **Run Docker Compose:**

```bash
   docker-compose up --build
```
Note: Make sure Docker is installed and running on your machine.

