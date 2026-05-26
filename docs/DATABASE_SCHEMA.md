# Database Schema - BookNova

## 🗄️ Firestore Collections

### Users Collection

**Collection Name:** `users`

**Document Structure:**

```javascript
{
  // Authentication
  username: String,           // unique, required
  email: String,              // unique, required
  password: String,           // hashed with bcryptjs

  // Profile
  address: String,            // required
  avatar: String,             // default profile image URL
  role: String,               // enum: "user" | "admin"

  // Relationships (array of document IDs)
  favourites: Array<String>,  // bookIds in favorites
  cart: Array<String>,        // bookIds in cart
  orders: Array<String>,      // orderIds placed by user

  // Metadata
  createdAt: Timestamp,       // document creation time
  updatedAt: Timestamp        // last update time
}
```

**Example Document:**

```json
{
  "id": "u7X9mK2L5pQ",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$hashed...",
  "address": "123 Main Street",
  "avatar": "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
  "role": "user",
  "favourites": ["book1", "book5", "book12"],
  "cart": ["book3", "book7"],
  "orders": ["order1", "order2", "order3"],
  "createdAt": "2024-05-27T10:30:00.000Z",
  "updatedAt": "2024-05-27T15:45:30.000Z"
}
```

---

### Books Collection

**Collection Name:** `books`

**Document Structure:**

```javascript
{
  // Book Information
  title: String,              // required
  author: String,             // required
  price: Number,              // required
  desc: String,               // description, required
  language: String,           // required
  url: String,                // image URL, required

  // Metadata
  createdAt: Timestamp,       // document creation time
  updatedAt: Timestamp        // last update time
}
```

**Example Document:**

```json
{
  "id": "book1",
  "url": "https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg",
  "title": "Harry Potter and the Philosopher's Stone",
  "author": "J.K. Rowling",
  "price": 12.99,
  "desc": "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat. A young boy discovers he is a wizard and begins his journey at Hogwarts School of Witchcraft and Wizardry...",
  "language": "English",
  "createdAt": "2024-05-27T10:00:00.000Z",
  "updatedAt": "2024-05-27T10:00:00.000Z"
}
```

**Total Books:** 51 (seeded from booksData.js)

---

### Orders Collection

**Collection Name:** `orders`

**Document Structure:**

```javascript
{
  // References
  user: String,               // userId reference
  book: String,               // bookId reference

  // Status
  status: String,             // enum: "Order Placed" | "Out for delivery" | "Delivered" | "Canceled"

  // Metadata
  createdAt: Timestamp,       // order creation time
  updatedAt: Timestamp        // last status update time
}
```

**Example Document:**

```json
{
  "id": "order1",
  "user": "u7X9mK2L5pQ",
  "book": "book1",
  "status": "Order Placed",
  "createdAt": "2024-05-27T14:30:00.000Z",
  "updatedAt": "2024-05-27T14:30:00.000Z"
}
```

---

## 🔗 Relationships

### User → Books (Many-to-Many)

- **Through:** `users.cart` array
- **Type:** Weak reference (stores bookIds as strings)
- **Example:** User has [book1, book3, book5] in cart

### User → Books (Many-to-Many)

- **Through:** `users.favourites` array
- **Type:** Weak reference (stores bookIds as strings)
- **Example:** User likes [book2, book4, book10]

### User → Orders (One-to-Many)

- **Through:** `users.orders` array & `orders.user` reference
- **Type:** Bidirectional reference
- **Example:** User has [order1, order2, order3]

### Order → Book (Many-to-One)

- **Through:** `orders.book` reference
- **Type:** Single reference
- **Example:** Order references book1

---

## 📊 Data Size Reference

| Collection | Documents | Avg Size   | Total    |
| ---------- | --------- | ---------- | -------- |
| books      | 51        | ~500 bytes | ~25 KB   |
| users      | Grows     | ~800 bytes | Variable |
| orders     | Grows     | ~200 bytes | Variable |

---

## 🔍 Indexing

### Recommended Indexes

**Books Collection**

- `createdAt (Descending)` - For sorting newest first in get-all-books

**Orders Collection**

- `user (Ascending), createdAt (Descending)` - For getting user's orders

**Users Collection**

- `username (Ascending)` - For uniqueness check
- `email (Ascending)` - For uniqueness check

---

## 🔐 Firestore Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth == null; // Allow signup
      allow update: if request.auth.uid == userId;
    }

    // Anyone can read books
    match /books/{bookId} {
      allow read: if true;
      allow create, update, delete: if false; // Use backend only
    }

    // Users can read their own orders
    match /orders/{orderId} {
      allow read: if resource.data.user == request.auth.uid;
      allow create: if request.auth.uid == request.resource.data.user;
      allow update: if false; // Use backend only
    }
  }
}
```

---

## 🔄 Data Flow Examples

### When User Signs Up

```
POST /sign-up
├── Create document in users collection
├── Fields: username, email, password (hashed), address
├── Initialize: favourites = [], cart = [], orders = []
└── Return: success message
```

### When User Adds Book to Cart

```
PUT /add-to-cart
├── Get user document
├── Check if bookId already in cart array
├── If not: Add bookId to favourites array
├── Update document: users.cart = [...cart, bookId]
└── Return: success message
```

### When User Places Order

```
POST /place-order
├── For each book in user's cart:
│   ├── Create new document in orders collection
│   ├── Set: user = userId, book = bookId, status = "Order Placed"
│   └── Push orderId to users.orders array
├── Remove all cart items from users.cart array
└── Return: success message
```

### When Admin Updates Order Status

```
PUT /update-status/:id
├── Get order document by id
├── Validate new status value
├── Update: orders.status = newStatus
├── Update: orders.updatedAt = now()
└── Return: success message
```

---

## 📈 Data Constraints

| Field    | Type   | Required | Unique | Constraints             |
| -------- | ------ | -------- | ------ | ----------------------- |
| username | String | Yes      | Yes    | Length > 3              |
| email    | String | Yes      | Yes    | Valid email             |
| password | String | Yes      | No     | Length > 5, hashed      |
| price    | Number | Yes      | No     | > 0                     |
| status   | String | Yes      | No     | Enum: 4 values          |
| role     | String | No       | No     | Enum: "user" \| "admin" |

---

## 🗑️ Deletion & Cleanup

### What happens when a book is deleted?

- Book document removed from books collection
- Book references removed from all users' cart[] arrays
- Book references removed from all users' favourites[] arrays
- Existing order documents remain (historical record)

### What happens when a user deletes account?

- User document removed
- User's orders remain (for admin reference)
- Cart and favorites data lost

---

## 💾 Backup & Recovery

**Firebase Backups:**

- Automatic daily backups (Firebase Standard feature)
- Manual export available from Firebase Console
- 30-day retention for point-in-time recovery

**Seed Data:**

- All 51 books can be re-seeded using `npm run seed`
- Test data persists in Firestore
- No production data loss from re-seeding (adds duplicates only)
