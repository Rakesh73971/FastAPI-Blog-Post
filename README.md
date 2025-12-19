

# 📘 Blog Post API 

## 1️⃣ Project Overview

This project is a **Blog Post REST API** built using **FastAPI**, where users can create, like, and manage blog posts securely.

The system supports:

* User authentication using **JWT**
* Post ownership & authorization
* Like (vote) and unlike functionality
* PostgreSQL database
* Dockerized deployment
* Database migrations using Alembic

---

## 2️⃣ Tech Stack Used

* **Backend Framework:** FastAPI
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Authentication:** JWT (OAuth2 Password Flow)
* **Migrations:** Alembic
* **Containerization:** Docker & Docker Compose
* **API Docs:** OpenAPI (Swagger UI)

---

## 3️⃣ Core Models

### 📌 User

Represents registered users.

Key fields:

* id
* email
* password (hashed)
* created_at

---

### 📌 Post

Represents blog posts created by users.

Key fields:

* id
* title
* content
* published
* created_at
* owner_id (ForeignKey → User)

👉 Only the **post owner** can update or delete the post.

---

### 📌 Vote

Represents likes on posts.

Key fields:

* user_id
* post_id

👉 A user can:

* Like a post
* Remove (unlike) their like
  👉 A user **cannot like the same post twice**

---

## 4️⃣ Authentication & Authorization

### 🔐 JWT Authentication

* Users log in using email & password
* Server generates **JWT access token**
* Token must be passed in headers:

```
Authorization: Bearer <token>
```

---

### 🔑 Authorization Rules

| Action      | Permission         |
| ----------- | ------------------ |
| Create Post | Authenticated user |
| Update Post | Only post owner    |
| Delete Post | Only post owner    |
| Like Post   | Authenticated user |
| Unlike Post | Authenticated user |

This ensures **secure access control**.

---

## 5️⃣ API Behavior & Responses

### 📌 Create Post

* Only authenticated users can create posts
* Post is automatically linked to the creator

---

### 📌 Get Posts (with Owner & Votes)

When fetching posts, the API returns:

* Post details
* Owner (user) information
* Total number of likes (votes)

📄 Example Response:

```json
{
  "id": 10,
  "title": "FastAPI Guide",
  "content": "FastAPI is a modern web framework",
  "published": "True",
  "created":"2025-12-12"
  "owner": {
    "id": 3,
    "email": "user@example.com",
    "created_at":"2025-12-12"
  },
  "votes": 5
}
```

This avoids extra API calls and improves **frontend efficiency**.

---

### 📌 Like / Unlike Post

* Liking a post creates a vote record
* Unliking removes the vote record
* Duplicate likes are prevented

📄 Example:

```json
{
  "message": "Post liked successfully"
}
```

---

## 6️⃣ Database Design

* **One-to-Many:** User → Posts
* **Many-to-Many (via Vote table):**

  * Users ↔ Posts

Alembic is used to:

* Track schema changes
* Apply migrations safely
* Maintain database consistency

---

## 7️⃣ Dockerization

The project is fully containerized using **Docker**.

Includes:

* FastAPI application container
* PostgreSQL container
* Environment-based configuration

### Benefits:

* Consistent development environment
* Easy deployment
* No local dependency issues

---

## 8️⃣ Environment Configuration

Sensitive data is managed using environment variables:

* Database credentials
* JWT secret key
* Token expiry time

This ensures **security and flexibility** across environments.

---

## 9️⃣ Error Handling

The API returns meaningful HTTP responses:

| Status Code | Meaning               |
| ----------- | --------------------- |
| 401         | Unauthorized          |
| 403         | Forbidden (not owner) |
| 404         | Resource not found    |
| 409         | Duplicate vote        |
| 422         | Validation error      |

---

## 🔟 API Documentation

FastAPI automatically generates:

* Swagger UI → `/docs`
* Redoc → `/redoc`

These provide:

* Interactive API testing
* Request/response schema
* Authentication testing
