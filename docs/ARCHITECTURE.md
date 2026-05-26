# Project Architecture - BookNova

## 📁 Project Structure

```
BookNova/
├── backend/
│   ├── app.js                          (Main server entry point)
│   ├── firebase.js                     (Firestore connection)
│   ├── seed.js                         (Data seeding script)
│   ├── booksData.js                    (51 books data)
│   ├── package.json                    (Dependencies)
│   ├── .env                            (Configuration)
│   │
│   ├── services/                       (Business logic)
│   │   ├── userService.js              (User operations)
│   │   ├── bookService.js              (Book operations)
│   │   └── orderService.js             (Order operations)
│   │
│   ├── routes/                         (API endpoints)
│   │   ├── user.js                     (Auth & profile)
│   │   ├── book.js                     (Book management)
│   │   ├── cart.js                     (Cart operations)
│   │   ├── favourite.js                (Favorites management)
│   │   ├── order.js                    (Order management)
│   │   └── userAuth.js                 (JWT middleware)
│   │
│   └── conn/
│       └── conn.js                     (Deprecated - MongoDB)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                     (Main component & routing)
│   │   ├── main.jsx                    (React entry point)
│   │   ├── App.css                     (Global styles)
│   │   ├── index.css                   (Tailwind setup)
│   │   │
│   │   ├── components/                 (Reusable UI components)
│   │   │   ├── Navbar/                 (Navigation header)
│   │   │   ├── Footer/                 (Footer section)
│   │   │   ├── BookCard/               (Book display card)
│   │   │   ├── Loader/                 (Loading spinner)
│   │   │   ├── Home/                   (Hero & recent books)
│   │   │   ├── ViewBookDetails/        (Book details page)
│   │   │   └── Profile/                (User profile layout)
│   │   │       ├── Sidebar.jsx
│   │   │       ├── MobileNav.jsx
│   │   │       ├── Favourite.jsx
│   │   │       ├── UserOrderHistory.jsx
│   │   │       ├── Settings.jsx
│   │   │       └── AllOrders.jsx (admin)
│   │   │
│   │   ├── pages/                      (Full page components)
│   │   │   ├── Home.jsx
│   │   │   ├── AllBooks.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── LogIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── UpdateBook.jsx (admin)
│   │   │   ├── AddBook.jsx (admin)
│   │   │   ├── AllOrders.jsx (admin)
│   │   │   └── SeeUserData.jsx (admin)
│   │   │
│   │   ├── store/                      (Redux state management)
│   │   │   ├── index.js                (Store configuration)
│   │   │   └── auth.js                 (Auth slice)
│   │   │
│   │   └── assets/                     (Images, icons, etc)
│   │
│   ├── package.json                    (Dependencies)
│   ├── vite.config.js                  (Vite configuration)
│   ├── tailwind.config.js              (Tailwind CSS setup)
│   └── eslint.config.js                (Linting rules)
│
└── docs/                               (Documentation)
    ├── README.md                       (Documentation index)
    ├── PROJECT_OVERVIEW.md
    ├── ARCHITECTURE.md
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    ├── SETUP_GUIDE.md
    ├── TECHNOLOGY_STACK.md
    └── MIGRATION_GUIDE.md
```

---

## 🔄 Data Flow Architecture

### Authentication Flow

```
User Input → SignUp/LogIn → Backend Validation
→ Password Hash/Verify → JWT Token Generated
→ Token Sent to Frontend → Stored in localStorage
→ User Authenticated ✅
```

### Add to Cart Flow

```
User Clicks "Add to Cart" → bookid Sent to Backend
→ Check if Already in Cart → Add to user.cart Array
→ Firestore Updated → Success Response
→ Frontend UI Updated ✅
```

### Place Order Flow

```
User Clicks "Place Order" → POST /place-order
→ Loop through cart items
→ Create Order document for each item
→ Push Order IDs to user.orders array
→ Remove items from user.cart
→ Response with success message
→ Clear cart in UI → Show order confirmation ✅
```

### Admin Update Order Status

```
Admin Selects new Status → PUT /update-status/:id
→ Server validates status value
→ Updates Order document
→ Response with success
→ UI refreshes to show new status ✅
```

---

## 🏗️ Backend Architecture

### Service Layer Pattern

- **Separation of Concerns**: Business logic separate from routes
- **Reusable**: Service functions used across different routes
- **Testable**: Easy to unit test service functions
- **Maintainable**: Changes in one place affect entire app

**Services:**

- `userService.js`: 20+ functions for user operations
- `bookService.js`: 6 functions for book operations
- `orderService.js`: 4 functions for order operations

### Middleware Pattern

- **JWT Authentication**: `authenticateToken()` protects routes
- **CORS**: Allows frontend to communicate with backend
- **Body Parser**: `express.json()` for parsing request bodies
- **Error Handling**: Try-catch blocks in all route handlers

---

## ⚛️ Frontend Architecture

### Component Hierarchy

```
App (Routes & Provider)
├── Navbar (Auth-aware navigation)
├── Routes
│   ├── Home
│   │   ├── Hero
│   │   └── RecentlyAdded
│   ├── AllBooks (Grid of BookCards)
│   ├── ViewBookDetails (Single book page)
│   ├── Cart (Items list)
│   ├── Profile (Nested routes)
│   │   ├── Favourites
│   │   ├── OrderHistory
│   │   └── Settings
│   ├── SignUp
│   ├── LogIn
│   └── Admin Pages
│       ├── AddBook
│       ├── UpdateBook
│       └── AllOrders
└── Footer
```

### State Management (Redux)

- **Store**: Single source of truth for auth state
- **Auth Slice**: isLoggedIn, role, user info
- **Reducers**: login, logout, changeRole actions
- **Middleware**: axios interceptors for token attachment

### Routing (React Router)

- **Dynamic Routes**: `/view-book-details/:id` for book pages
- **Nested Routes**: Profile with child pages (favorites, orders, settings)
- **Protected Routes**: Check auth before rendering admin pages
- **Programmatic Navigation**: `useNavigate()` for redirects after actions

---

## 🔗 Component Communication

### Parent to Child

```
App → Navbar (pass isLoggedIn prop)
AllBooks → BookCard (pass book data prop)
Cart → CartItem (pass item & remove function)
```

### Child to Parent

```
BookCard.handleCart() → calls parent function
SignUp.handleSubmit() → updates Redux store
Settings.handleUpdate() → sends API request
```

### Global State (Redux)

```
Any Component → useDispatch() → Send action to store
Any Component → useSelector() → Read state from store
Auth data available everywhere without prop drilling
```

### API Communication (Axios)

```
Component → useEffect() → Axios.get/post/put/delete
Response → setState or Redux dispatch
Errors → Catch block → Show error toast
```

---

## 🗄️ Database Design

### Firestore Collections

**Users Collection**

- Document ID = Firebase UID (string)
- Fields: username, email, password, address, role, avatar
- Arrays: favourites[], cart[], orders[] (store IDs as strings)
- Timestamps: createdAt, updatedAt

**Books Collection**

- Document ID = Auto-generated (string)
- Fields: title, author, price, description, language, image URL
- Timestamps: createdAt, updatedAt
- Indexed for sorting by createdAt

**Orders Collection**

- Document ID = Auto-generated (string)
- Fields: user (userId string), book (bookId string), status
- Status Values: "Order Placed", "Out for delivery", "Delivered", "Canceled"
- Timestamps: createdAt, updatedAt
- Indexed by user ID for user order queries

---

## 🔐 Security Implementation

### Authentication

- JWT tokens with 30-day expiration
- Tokens verified on every protected route
- Password hashed with bcryptjs (10 salt rounds)

### Authorization

- Role check: "admin" role required for book/order management
- User ownership check: Can only access own cart/orders
- Middleware prevents unauthorized access

### Data Protection

- Passwords never returned in API responses
- Sensitive data filtered with `.select('-password')`
- CORS configured to allow only authorized origins

---

## 📈 Performance Considerations

### Caching

- Bookdata cached on component mount
- User data fetched on profile page load
- Local state for UI (cart display, favorites)

### Optimization

- Lazy loading for images (loading spinners)
- Conditional rendering (Loader while fetching)
- Responsive images for different screen sizes
- Debounced search (if implemented)

### API Efficiency

- Batch operations for order placement
- Indexed queries in Firestore
- Automatic data population in services
