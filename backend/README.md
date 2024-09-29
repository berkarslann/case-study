# User Management Backend

This is the backend part of the User Management System, built using NestJS. The backend provides various endpoints to handle user-related operations such as creating, updating, retrieving, and searching users.

## Features

- **User Management API**: Provides endpoints for creating, reading and updating users.
- **Password Encryption**: Encrypts user passwords before storing them in the database.
- **Search & Pagination**: Supports search and pagination for listing users.

## API Endpoints

| Method | Endpoint        | Description                                                             | Query Parameters             | Request Body                                                                                                     |
| ------ | --------------- | ----------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| GET    | `/users`        | Retrieves all users with pagination and optional search                 | `page`, `pageSize`, `search` | N/A                                                                                                              |
| GET    | `/users/:id`    | Retrieves the user information for the given user ID                    | N/A                          | N/A                                                                                                              |
| POST   | `/users/save`   | Creates a new user and saves it to the database with encrypted password | N/A                          | `{ "username": "berk", "email": "berk@example.com", "password": "password123" }`                                 |
| POST   | `/users/update` | Updates an existing user record in the database                         | N/A                          | `{ "id": "123", "username": "berk_updated", "email": "berk_updated@example.com", "password": "newpassword123" }` |

## Installation

1. **Clone the Repository:**

```bash
    git clone https://github.com/berkarslann/case-study.git
```

2. **To make necessary downloads for backend:**

```bash
   cd backend
   npm install
```

3. **To run project:**

```bash
   npm start
```
