# API Documentation - BookNova

## 🔗 Base URL

```
http://localhost:5000/api/v1
```

---

## 🔐 Authentication

### Header Format

```
authorization: Bearer <jwt_token>
id: <user_id>
```

### Token Example

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhaW1zIjpbeyJuYW1lIjp7fSwiMm9sZSI6InVzZXIifV0sImlhdCI6MTcxNjc5MTA4MCwiZXhwIjoxNzE5MzgzMDgwfQ...
```

---

## 👤 User Endpoints

### Sign Up (Register)

**POST** `/sign-up`

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "123 Main Street"
}
```

**Validation:**

- Username length > 3 characters
- Email must not exist
- Username must be unique
- Password length > 5 characters

**Response (200):**

```json
{
  "message": "SignUp Successfully"
}
```

**Error Response (400):**

```json
{
  "message": "Username already exists"
}
```

---

### Sign In (Login)

**POST** `/sign-in`

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "id": "u7X9mK2L5pQ",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**

```json
{
  "message": "Invalid credentials"
}
```

---

### Get User Information

**GET** `/get-user-information`

**Headers Required:**

```
id: <user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": "u7X9mK2L5pQ",
  "username": "john_doe",
  "email": "john@example.com",
  "address": "123 Main Street",
  "role": "user",
  "avatar": "https://...",
  "favourites": ["book1", "book2"],
  "cart": ["book3"],
  "orders": ["order1"]
}
```

---

### Update Address

**PUT** `/update-address`

**Headers Required:**

```
id: <user_id>
authorization: Bearer <token>
```

**Request Body:**

```json
{
  "address": "456 Oak Avenue"
}
```

**Response (200):**

```json
{
  "message": "Adress updated successfully"
}
```

---

## 📚 Book Endpoints

### Get All Books

**GET** `/get-all-books`

**Query Parameters:** None

**Response (200):**

```json
{
  "status": "Success",
  "data": [
    {
      "id": "book1",
      "url": "https://...",
      "title": "Harry Potter",
      "author": "J.K. Rowling",
      "price": 12.99,
      "desc": "...",
      "language": "English",
      "createdAt": "2024-05-27T10:30:00Z"
    },
    ...
  ]
}
```

---

### Get Recent Books

**GET** `/get-recent-books`

**Returns:** Last 4 books by creation date

**Response (200):**

```json
{
  "status": "Success",
  "data": [
    {
      "id": "book1",
      "url": "https://...",
      "title": "Recent Book",
      ...
    }
  ]
}
```

---

### Get Book by ID

**GET** `/get-book-by-id/:id`

**Parameters:**

- `id` (path): Book document ID

**Response (200):**

```json
{
  "status": "Success",
  "data": {
    "id": "book1",
    "url": "https://...",
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "J.K. Rowling",
    "price": 12.99,
    "desc": "Young wizard discovers Hogwarts...",
    "language": "English"
  }
}
```

**Error Response (404):**

```json
{
  "message": "Book not found"
}
```

---

### Add Book (Admin Only)

**POST** `/add-book`

**Headers Required:**

```
id: <admin_user_id>
authorization: Bearer <token>
```

**Request Body:**

```json
{
  "url": "https://example.com/book.jpg",
  "title": "New Book",
  "author": "Author Name",
  "price": 19.99,
  "desc": "Book description",
  "language": "English"
}
```

**Response (200):**

```json
{
  "message": "Book added successfully",
  "id": "newBookId"
}
```

**Error (400):**

```json
{
  "message": "You are not have access to perform admin work"
}
```

---

### Update Book (Admin Only)

**PUT** `/update-book`

**Headers Required:**

```
bookid: <book_id>
id: <admin_user_id>
authorization: Bearer <token>
```

**Request Body:**

```json
{
  "url": "https://example.com/updated-book.jpg",
  "title": "Updated Title",
  "author": "Updated Author",
  "price": 14.99,
  "desc": "Updated description",
  "language": "English"
}
```

**Response (200):**

```json
{
  "message": "Book Updated successfully"
}
```

---

### Delete Book (Admin Only)

**DELETE** `/delete-book`

**Headers Required:**

```
bookid: <book_id>
id: <admin_user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Book deleted Successfully !"
}
```

---

## 🛒 Cart Endpoints

### Add to Cart

**PUT** `/add-to-cart`

**Headers Required:**

```
bookid: <book_id>
id: <user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "status": "Success",
  "message": "Book added to cart"
}
```

**If Already in Cart:**

```json
{
  "status": "Success",
  "message": "Book is already in cart"
}
```

---

### Remove from Cart

**PUT** `/remove-from-cart/:bookid`

**Headers Required:**

```
id: <user_id>
authorization: Bearer <token>
```

**Parameters:**

- `bookid` (path): Book document ID

**Response (200):**

```json
{
  "status": "Success",
  "message": "Book removed from cart"
}
```

---

### Get User Cart

**GET** `/get-user-cart`

**Headers Required:**

```
id: <user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "status": "Success",
  "data": [
    {
      "id": "book1",
      "title": "Harry Potter",
      "author": "J.K. Rowling",
      "price": 12.99,
      "url": "https://...",
      "desc": "...",
      "language": "English"
    }
  ]
}
```

---

## ❤️ Favourite Endpoints

### Add to Favorites

**PUT** `/add-book-to-favourite`

**Headers Required:**

```
bookid: <book_id>
id: <user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Book Added Favourites"
}
```

---

### Remove from Favorites

**PUT** `/remove-book-from-favourite`

**Headers Required:**

```
bookid: <book_id>
id: <user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Book removed Favourites"
}
```

---

### Get Favorite Books

**GET** `/get-favourite-books`

**Headers Required:**

```
id: <user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "status": "Success",
  "data": [
    {
      "id": "book1",
      "title": "Favorite Book",
      "author": "Author Name",
      "price": 12.99,
      ...
    }
  ]
}
```

---

## 📦 Order Endpoints

### Place Order

**POST** `/place-order`

**Headers Required:**

```
id: <user_id>
authorization: Bearer <token>
```

**Request Body:**

```json
{
  "order": [
    {
      "_id": "book1",
      "title": "Book 1"
    },
    {
      "_id": "book2",
      "title": "Book 2"
    }
  ]
}
```

**Note:** Array of book IDs from user's cart

**Response (200):**

```json
{
  "status": "Success",
  "message": "Order Placed Successfully"
}
```

---

### Get Order History

**GET** `/get-order-history`

**Headers Required:**

```
id: <user_id>
authorization: Bearer <token>
```

**Returns:** Reverse chronological order (newest first)

**Response (200):**

```json
{
  "status": "Success",
  "data": [
    {
      "id": "order1",
      "book": {
        "id": "book1",
        "title": "Harry Potter",
        "author": "J.K. Rowling",
        "price": 12.99
      },
      "user": "u7X9mK2L5pQ",
      "status": "Delivered",
      "createdAt": "2024-05-27T10:30:00Z"
    }
  ]
}
```

---

### Get All Orders (Admin Only)

**GET** `/get-all-orders`

**Headers Required:**

```
id: <admin_user_id>
authorization: Bearer <token>
```

**Response (200):**

```json
{
  "status": "Success",
  "data": [
    {
      "id": "order1",
      "user": {
        "id": "u7X9mK2L5pQ",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "book": {
        "id": "book1",
        "title": "Harry Potter",
        "price": 12.99
      },
      "status": "Order Placed",
      "createdAt": "2024-05-27T10:30:00Z"
    }
  ]
}
```

---

### Update Order Status (Admin Only)

**PUT** `/update-status/:id`

**Headers Required:**

```
id: <admin_user_id>
authorization: Bearer <token>
```

**Parameters:**

- `id` (path): Order document ID

**Request Body:**

```json
{
  "status": "Out for delivery"
}
```

**Valid Status Values:**

- "Order Placed"
- "Out for delivery"
- "Delivered"
- "Canceled"

**Response (200):**

```json
{
  "status": "Success",
  "message": "Status Updated Successfully"
}
```

---

## 📊 Status Codes Reference

| Code | Meaning      | Cause                           |
| ---- | ------------ | ------------------------------- |
| 200  | OK           | Request successful              |
| 400  | Bad Request  | Invalid input/validation failed |
| 401  | Unauthorized | Missing/invalid token           |
| 403  | Forbidden    | Token expired/invalid role      |
| 404  | Not Found    | Resource doesn't exist          |
| 500  | Server Error | Internal server error           |

---

## 🔒 Security Notes

- All requests to protected endpoints require JWT token
- Passwords never returned in responses
- Admin operations check role before executing
- User operations check ownership (can only access own data)
- CORS allows frontend domain only
