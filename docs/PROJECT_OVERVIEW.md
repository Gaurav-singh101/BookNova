# Project Overview - BookNova

## 📌 What is BookNova?

**BookNova** is a full-stack e-commerce web application for buying and selling books online.

## ✨ Key Features

### User Features

- ✅ User registration and authentication (JWT)
- ✅ Browse all books in the catalog
- ✅ View detailed book information
- ✅ Add/remove books to cart
- ✅ Add/remove books to favorites
- ✅ Place orders from cart
- ✅ View order history with status
- ✅ Update profile and address
- ✅ Responsive design (mobile, tablet, desktop)

### Admin Features

- ✅ Add new books to catalog
- ✅ Update book details
- ✅ Delete books from catalog
- ✅ View all user orders
- ✅ Update order status (Order Placed → Delivered)
- ✅ Manage book inventory

### Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Role-based access control (User/Admin)
- ✅ Protected API routes with middleware
- ✅ CORS enabled for frontend access
- ✅ Secure Firebase Firestore database

---

## 🎯 Current Database

- **Total Books**: 51 (seeded from booksData.js)
- **Collections**: users, books, orders
- **Database**: Firebase Firestore
- **Status**: Production ready

---

## 👥 User Roles

### Regular User

- Cannot add/update/delete books
- Can only manage their own cart, favorites, orders
- Can update their address

### Admin User

- Full control over books (add, update, delete)
- Can view all orders in the system
- Can update order statuses
- Cannot delete user accounts

---

## 📱 Responsive Design

- **Mobile** (< 768px): Single column, optimized touch interface
- **Tablet** (768px - 1024px): Two column layout
- **Desktop** (> 1024px): Full featured layout with sidebars

---

## 🔐 Authentication & Authorization

**How It Works:**

1. User signs up → Password hashed with bcryptjs
2. User logs in → JWT token generated
3. Token stored in localStorage
4. Every protected request includes token in header
5. Server verifies token before allowing access

**Token Format:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Main Collections

### Users Collection

- username, email, password (hashed)
- address, avatar, role
- Embedded: favourites[], cart[], orders[]

### Books Collection

- title, author, price, description
- language, image URL
- Timestamps: createdAt, updatedAt

### Orders Collection

- user ID, book ID
- status (Order Placed → Delivered)
- Timestamps: createdAt, updatedAt

---

## 🚀 Deployment Status

- **Backend**: Ready for deployment
- **Frontend**: Ready for deployment
- **Database**: Firebase (cloud-hosted, always available)
- **API Port**: 5000 (configured via .env)
- **Frontend Port**: 5173 (Vite default)

---

## 📈 Future Enhancements

- Payment gateway integration (Stripe/Razorpay)
- Email notifications for orders
- Book reviews and ratings
- Search and advanced filtering
- Pagination for large datasets
- Image upload functionality
- Password reset feature
