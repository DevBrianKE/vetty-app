# Vetty App Database Schema

This document outlines the PostgreSQL database schema for the Vetty full-stack veterinary e-commerce application.

---

## 1️⃣ Users Table

Stores all users, including customers and admins.

| Column       | Type        | Constraints                   | Description                       |
|-------------|------------|-------------------------------|-----------------------------------|
| id          | SERIAL     | PRIMARY KEY                   | Unique user ID                     |
| username    | VARCHAR(50)| NOT NULL, UNIQUE              | User display name                  |
| email       | VARCHAR(100)| NOT NULL, UNIQUE             | Login email                        |
| password    | VARCHAR(255)| NOT NULL                      | Hashed password                    |
| role        | VARCHAR(20)| NOT NULL, DEFAULT 'user'      | 'user' or 'admin'                  |
| created_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP     | Account creation timestamp         |
| updated_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP     | Last update                        |

---

## 2️⃣ Products Table

Stores all products sold in Vetty.

| Column       | Type        | Constraints             | Description                       |
|-------------|------------|-------------------------|-----------------------------------|
| id          | SERIAL     | PRIMARY KEY             | Product ID                        |
| name        | VARCHAR(100)| NOT NULL                | Product name                       |
| description | TEXT       |                         | Product description                |
| price       | NUMERIC(10,2)| NOT NULL               | Product price                      |
| stock       | INT        | NOT NULL DEFAULT 0      | Available quantity                 |
| image_url   | TEXT       |                         | URL to product image               |
| created_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Creation timestamp               |
| updated_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Last update                       |

---

## 3️⃣ Services Table

Stores all veterinary services available.

| Column       | Type        | Constraints             | Description                       |
|-------------|------------|-------------------------|-----------------------------------|
| id          | SERIAL     | PRIMARY KEY             | Service ID                        |
| name        | VARCHAR(100)| NOT NULL                | Service name                       |
| description | TEXT       |                         | Service details                    |
| price       | NUMERIC(10,2)| NOT NULL               | Service price                      |
| duration    | INT        | NOT NULL                | Duration in minutes                |
| created_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Creation timestamp               |
| updated_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Last update                       |

---

## 4️⃣ Orders Table

Stores product orders from users.

| Column       | Type        | Constraints             | Description                       |
|-------------|------------|-------------------------|-----------------------------------|
| id          | SERIAL     | PRIMARY KEY             | Order ID                           |
| user_id     | INT        | REFERENCES users(id)    | Who placed the order               |
| total_price | NUMERIC(10,2)| NOT NULL               | Total price of order               |
| status      | VARCHAR(20)| DEFAULT 'pending'       | pending, approved, delivered, canceled |
| created_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Order creation time               |
| updated_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Last update                        |

---

## 5️⃣ Order_Items Table

Stores individual products in an order (many-to-many relationship with Orders).

| Column       | Type        | Constraints             | Description                       |
|-------------|------------|-------------------------|-----------------------------------|
| id          | SERIAL     | PRIMARY KEY             | Item ID                            |
| order_id    | INT        | REFERENCES orders(id)   | Order it belongs to                |
| product_id  | INT        | REFERENCES products(id) | Product being purchased            |
| quantity    | INT        | NOT NULL                | Quantity ordered                   |
| price       | NUMERIC(10,2)| NOT NULL               | Price per unit at order time       |

---

## 6️⃣ Bookings Table

Stores user appointments for services.

| Column       | Type        | Constraints             | Description                       |
|-------------|------------|-------------------------|-----------------------------------|
| id          | SERIAL     | PRIMARY KEY             | Booking ID                        |
| user_id     | INT        | REFERENCES users(id)    | User booking the service          |
| service_id  | INT        | REFERENCES services(id) | Service being booked              |
| date        | TIMESTAMP  | NOT NULL                | Scheduled date and time           |
| status      | VARCHAR(20)| DEFAULT 'pending'       | pending, approved, completed, canceled |
| created_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Booking creation time            |
| updated_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Last update                       |

---

## 7️⃣ Reviews Table

Stores ratings and reviews for products or services.

| Column       | Type        | Constraints             | Description                       |
|-------------|------------|-------------------------|-----------------------------------|
| id          | SERIAL     | PRIMARY KEY             | Review ID                          |
| user_id     | INT        | REFERENCES users(id)    | User who wrote the review          |
| product_id  | INT        | REFERENCES products(id) | Optional: Product reviewed        |
| service_id  | INT        | REFERENCES services(id) | Optional: Service reviewed        |
| rating      | INT        | NOT NULL CHECK (rating BETWEEN 1 AND 5) | Rating (1-5) |
| comment     | TEXT       |                         | Review text                        |
| created_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Review creation time             |
| updated_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Last update                       |

---

## Relationships

- **Users → Orders** (1:N)
- **Orders → Order_Items → Products** (N:M)
- **Users → Bookings → Services** (1:N)
- **Users → Reviews → Products/Services** (1:N)
