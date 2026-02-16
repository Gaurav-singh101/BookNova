# BookNova - Full Stack Book Store Application

## 📌 Project Overview

**BookNova** is a full-stack e-commerce web application for buying and selling books online. It features a complete user authentication system, shopping cart functionality, order management, and an admin dashboard for managing books and orders.

---

## 🏗️ Architecture & Tech Stack

### Backend (Node.js + Express.js + MongoDB)

```
backend/
├── app.js              → Main server entry point
├── conn/conn.js        → MongoDB database connection
├── models/             → Mongoose schemas (User, Book, Order)
├── routes/             → REST API endpoints
└── package.json        → Backend dependencies
```

### Frontend (React.js + Vite + Tailwind CSS)

```
frontend/
├── src/
│   ├── App.jsx         → Main app with routing
│   ├── components/     → Reusable UI components
│   ├── pages/          → Page-level components
│   └── store/          → Redux state management
└── package.json        → Frontend dependencies
```

---

## 🔧 Technologies Used & Why

### Backend Technologies

| Technology             | What It Is                               | Why Used                                                                              |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| **Node.js**            | JavaScript runtime for server-side       | Allows using JavaScript on server, event-driven non-blocking I/O for high performance |
| **Express.js**         | Web framework for Node.js                | Simplifies routing, middleware handling, and API creation                             |
| **MongoDB**            | NoSQL document database                  | Flexible schema, stores data in JSON-like format, great for scalability               |
| **Mongoose**           | MongoDB ODM (Object Document Mapper)     | Provides schema validation, relationships, and easy database operations               |
| **JWT (jsonwebtoken)** | JSON Web Token library                   | Stateless authentication - stores user info in encrypted tokens                       |
| **bcryptjs**           | Password hashing library                 | Securely hashes passwords before storing (one-way encryption)                         |
| **cors**               | Cross-Origin Resource Sharing middleware | Allows frontend (different port) to communicate with backend                          |
| **dotenv**             | Environment variable loader              | Securely stores sensitive data (DB URI, secrets) outside code                         |
| **nodemon**            | Development tool                         | Auto-restarts server on code changes during development                               |

### Frontend Technologies

| Technology           | What It Is                  | Why Used                                                           |
| -------------------- | --------------------------- | ------------------------------------------------------------------ |
| **React.js**         | JavaScript UI library       | Component-based architecture, virtual DOM for fast rendering       |
| **Vite**             | Build tool & dev server     | Faster than Create React App, instant HMR (Hot Module Replacement) |
| **Redux Toolkit**    | State management library    | Centralized global state, predictable state updates                |
| **React Router DOM** | Client-side routing         | SPA navigation without page reloads                                |
| **Axios**            | HTTP client library         | Simplified API calls with promises, interceptors support           |
| **Tailwind CSS**     | Utility-first CSS framework | Rapid styling without writing custom CSS, responsive design        |
| **React Icons**      | Icon library                | Easy icon integration (FaHeart, FaShoppingCart, etc.)              |

---

## 📊 Database Schema Design

### User Model (`models/user.js`)

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  address: String (required),
  avatar: String (default profile image),
  role: String (enum: "user" | "admin"),
  favourites: [ObjectId] → references Book,
  cart: [ObjectId] → references Book,
  orders: [ObjectId] → references Order,
  timestamps: true → automatically adds createdAt, updatedAt
}
```

**Key Concepts:**

- **ObjectId Reference**: MongoDB's way of creating relationships between documents (like foreign keys)
- **Enum**: Restricts `role` to specific values only ("user" or "admin")
- **Timestamps**: Mongoose automatically tracks creation and modification times

### Book Model (`models/book.js`)

```javascript
{
  url: String (image URL),
  title: String,
  author: String,
  price: Number,
  desc: String (description),
  language: String,
  timestamps: true
}
```

### Order Model (`models/order.js`)

```javascript
{
  user: ObjectId → references User,
  book: ObjectId → references Book,
  status: String (enum: "Order Placed" | "Out for delivery" | "Delivered" | "Canceled"),
  timestamps: true
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User signs up → Password hashed with bcrypt → Stored in DB
2. User logs in → Password compared using bcrypt.compare()
3. If valid → JWT token generated with user info
4. Token sent to client → Stored in localStorage
5. Every protected request → Token sent in Authorization header
6. Server verifies token → Grants/denies access
```

### JWT Token Middleware (`routes/userAuth.js`)

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (token == null) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, "bookStore123", (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired" });
    req.user = user;
    next(); // Continue to route handler
  });
};
```

**Key Terms:**

- **Middleware**: Function that runs between request and response (intercepts requests)
- **Bearer Token**: Authentication scheme where "Bearer" prefix indicates token type
- **next()**: Passes control to the next middleware/route handler

### Role-Based Authorization

- **User**: Can add to cart, favourites, place orders, view order history
- **Admin**: Can add/update/delete books, view all orders, update order status

---

## 🛣️ API Routes Reference

### Base URL: `http://localhost:1000/api/v1`

### User Routes (`/routes/user.js`)

| Method | Endpoint                | Auth | Description                   |
| ------ | ----------------------- | ---- | ----------------------------- |
| POST   | `/sign-up`              | No   | Register new user             |
| POST   | `/sign-in`              | No   | Login user, returns JWT token |
| GET    | `/get-user-information` | Yes  | Get logged-in user's profile  |
| PUT    | `/update-address`       | Yes  | Update user's address         |

### Book Routes (`/routes/book.js`)

| Method | Endpoint              | Auth | Role  | Description                      |
| ------ | --------------------- | ---- | ----- | -------------------------------- |
| POST   | `/add-book`           | Yes  | Admin | Add new book                     |
| PUT    | `/update-book`        | Yes  | Admin | Update book details              |
| DELETE | `/delete-book`        | Yes  | Admin | Delete a book                    |
| GET    | `/get-all-books`      | No   | -     | Get all books (sorted by newest) |
| GET    | `/get-recent-books`   | No   | -     | Get 4 most recent books          |
| GET    | `/get-book-by-id/:id` | No   | -     | Get single book details          |

### Cart Routes (`/routes/cart.js`)

| Method | Endpoint                    | Auth | Description           |
| ------ | --------------------------- | ---- | --------------------- |
| PUT    | `/add-to-cart`              | Yes  | Add book to cart      |
| PUT    | `/remove-from-cart/:bookid` | Yes  | Remove book from cart |
| GET    | `/get-user-cart`            | Yes  | Get user's cart items |

### Favourite Routes (`/routes/favourite.js`)

| Method | Endpoint                      | Auth | Description            |
| ------ | ----------------------------- | ---- | ---------------------- |
| PUT    | `/add-book-to-favourite`      | Yes  | Add to favourites      |
| PUT    | `/remove-book-from-favourite` | Yes  | Remove from favourites |
| GET    | `/get-favourite-books`        | Yes  | Get user's favourites  |

### Order Routes (`/routes/order.js`)

| Method | Endpoint             | Auth | Role  | Description           |
| ------ | -------------------- | ---- | ----- | --------------------- |
| POST   | `/place-order`       | Yes  | User  | Place order from cart |
| GET    | `/get-order-history` | Yes  | User  | Get user's orders     |
| GET    | `/get-all-orders`    | Yes  | Admin | Get all orders        |
| PUT    | `/update-status/:id` | Yes  | Admin | Update order status   |

---

## ⚛️ Frontend Architecture

### State Management with Redux Toolkit

**Store Configuration (`store/index.js`):**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
```

**Auth Slice (`store/auth.js`):**

```javascript
const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, role: "user" },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    changeRole(state, action) {
      state.role = action.payload;
    },
  },
});
```

**Key Redux Terms:**

- **Store**: Single source of truth for global state
- **Slice**: Contains reducer logic and actions for a feature
- **Action**: Object that describes what happened (e.g., login, logout)
- **Reducer**: Pure function that takes state + action → returns new state
- **Dispatch**: Method to send actions to the store
- **useSelector**: Hook to read data from Redux store
- **useDispatch**: Hook to dispatch actions

### React Router DOM - Client-Side Routing

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/all-books" element={<AllBooks />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/profile" element={<Profile />}>
    {/* Nested Routes */}
    <Route index element={<Favourite />} /> {/* /profile */}
    <Route path="orderHistory" element={<UserOrderHistory />} />{" "}
    {/* /profile/orderHistory */}
    <Route path="settings" element={<Settings />} /> {/* /profile/settings */}
  </Route>
  <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
</Routes>
```

**Key Routing Terms:**

- **`<Routes>`**: Container for route definitions
- **`<Route>`**: Maps URL path to component
- **`index`**: Default child route (renders at parent path)
- **`:id`**: Dynamic parameter (accessed via `useParams()`)
- **`<Outlet>`**: Placeholder for nested routes to render
- **Nested Routes**: Routes inside routes (Profile → Favourite, Settings)

---

## 🧩 Component Structure & Explanation

### Component Hierarchy

```
App.jsx
├── Navbar.jsx (navigation, conditional rendering based on auth)
├── Routes
│   ├── Home.jsx
│   │   ├── Hero.jsx (landing section)
│   │   └── RecentlyAdded.jsx (latest 4 books)
│   ├── AllBooks.jsx (book grid)
│   │   └── BookCard.jsx (reusable book display)
│   ├── ViewBookDetails.jsx (single book page)
│   ├── Cart.jsx (shopping cart)
│   ├── Profile.jsx (user profile layout)
│   │   ├── Sidebar.jsx (desktop navigation)
│   │   ├── MobileNav.jsx (mobile navigation)
│   │   ├── Favourite.jsx (user favourites)
│   │   ├── UserOrderHistory.jsx (order list)
│   │   ├── Settings.jsx (update address)
│   │   ├── AllOrders.jsx (admin - all orders)
│   │   └── AddBook.jsx (admin - add book form)
│   ├── SignUp.jsx
│   └── LogIn.jsx
└── Footer.jsx
```

### Key React Concepts Used

**1. useState Hook - Local State Management**

```javascript
const [Cart, setCart] = useState([]); // Initialize state
const [total, setTotal] = useState(0); // Track total price
```

**2. useEffect Hook - Side Effects**

```javascript
useEffect(() => {
  const fetchData = async () => {
    const res = await axios.get("/api/v1/get-user-cart", { headers });
    setCart(res.data.data);
  };
  fetchData();
}, []); // Empty dependency array = runs once on mount
```

**3. Conditional Rendering**

```javascript
{
  isLoggedIn && role === "admin" && <AddBookButton />;
}
{
  !Cart && <Loader />;
}
{
  Cart && Cart.length === 0 && <EmptyCart />;
}
```

**4. Props - Passing Data to Components**

```javascript
// Parent
<BookCard data={book} favourite={true} />;

// Child
const BookCard = ({ data, favourite }) => {
  return <div>{data.title}</div>;
};
```

**5. useNavigate - Programmatic Navigation**

```javascript
const navigate = useNavigate();
navigate("/profile"); // Redirect after login
```

**6. useParams - URL Parameters**

```javascript
const { id } = useParams(); // Get book ID from URL
```

---

## 🔄 Key Workflows

### 1. User Registration Flow

```
SignUp.jsx → POST /sign-up → bcrypt hash password → Save to MongoDB → Success message
```

### 2. User Login Flow

```
LogIn.jsx → POST /sign-in → Verify credentials → Generate JWT → Store in localStorage → Redux login action → Navigate to profile
```

### 3. Add to Cart Flow

```
ViewBookDetails.jsx → handleCart() → PUT /add-to-cart → Check if already in cart → Push to user.cart array → Response message
```

### 4. Place Order Flow

```
Cart.jsx → PlaceOrder() → POST /place-order → Loop through cart items → Create Order documents → Push order IDs to user.orders → Remove from cart → Navigate to order history
```

### 5. Admin Update Order Status Flow

```
AllOrders.jsx → Select status dropdown → PUT /update-status/:id → Update Order document → Success message
```

---

## 🎨 UI/UX Features

1. **Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints (`md:`, `lg:`)
2. **Dark Theme**: Zinc color palette for modern dark mode aesthetic
3. **Loading States**: Loader component displayed while fetching data
4. **Conditional Navigation**: Different nav items based on auth status and role
5. **Empty States**: Visual feedback for empty cart, no data scenarios
6. **Mobile Navigation**: Hamburger menu for mobile devices

---

## 📱 Responsive Breakpoints (Tailwind)

| Prefix | Min Width | Description      |
| ------ | --------- | ---------------- |
| (none) | 0px       | Mobile (default) |
| `md:`  | 768px     | Tablet           |
| `lg:`  | 1024px    | Desktop          |

Example:

```jsx
<div className="flex flex-col md:flex-row lg:gap-8">
```

- Mobile: Column layout
- Tablet+: Row layout
- Desktop: Row layout with gap

---

## 🔑 Key Interview Talking Points

### 1. Why MERN Stack?

- Full JavaScript development (frontend + backend)
- JSON data flow throughout the stack
- Large ecosystem and community support
- MongoDB's flexibility for evolving schemas

### 2. Why JWT Instead of Sessions?

- **Stateless**: Server doesn't store session data
- **Scalable**: Works across multiple servers
- **Mobile-friendly**: Easy to store in apps
- **Self-contained**: Token contains all user info needed

### 3. Why Redux Toolkit?

- Centralized state prevents prop drilling
- Predictable state updates through reducers
- DevTools for debugging state changes
- Easier than vanilla Redux (less boilerplate)

### 4. Why Vite Over CRA?

- Faster development server (ES modules)
- Quicker build times
- Better Hot Module Replacement (HMR)
- Modern tooling with less configuration

### 5. Security Measures Implemented

- Password hashing with bcrypt (salt rounds: 10)
- JWT token authentication
- Protected routes with middleware
- Role-based access control
- CORS configuration

### 6. MongoDB Design Decisions

- Embedded arrays for favourites/cart (fast reads, atomic updates)
- References for orders (separate collection for order history)
- Timestamps for audit trail

---

## 🚀 How to Run the Project

### Backend Setup

```bash
cd backend
npm install
# Create .env file with:
# PORT=1000
# URI=your_mongodb_connection_string
nodemon app.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## 📝 API Testing Examples

### Sign Up

```json
POST http://localhost:1000/api/v1/sign-up
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "address": "123 Main Street"
}
```

### Sign In

```json
POST http://localhost:1000/api/v1/sign-in
{
    "username": "testuser",
    "password": "password123"
}
// Response: { "id": "...", "role": "user", "token": "eyJhbG..." }
```

### Protected Route Example

```
GET http://localhost:1000/api/v1/get-user-cart
Headers:
  id: <user_id>
  authorization: Bearer <jwt_token>
```

---

## 🎯 Future Improvements

1. **Payment Integration** (Razorpay/Stripe)
2. **Search & Filter** functionality
3. **Book Reviews & Ratings**
4. **Pagination** for large book lists
5. **Image Upload** (Cloudinary integration)
6. **Email Notifications** (Order confirmation)
7. **Password Reset** functionality
8. **Unit & Integration Tests** (Jest, React Testing Library)

---

## 📌 Quick Glossary

| Term           | Definition                                                              |
| -------------- | ----------------------------------------------------------------------- |
| **API**        | Application Programming Interface - contract for software communication |
| **REST**       | Representational State Transfer - architectural style for APIs          |
| **CRUD**       | Create, Read, Update, Delete - basic database operations                |
| **SPA**        | Single Page Application - no full page reloads                          |
| **JWT**        | JSON Web Token - secure way to transmit information                     |
| **ODM**        | Object Document Mapper - maps objects to database documents             |
| **Middleware** | Code that runs between request and response                             |
| **Hook**       | React function starting with `use` for state/lifecycle                  |
| **Component**  | Reusable UI building block in React                                     |
| **Props**      | Data passed from parent to child component                              |
| **State**      | Data that changes over time in a component                              |
| **Dispatch**   | Sending an action to Redux store                                        |

---

_Created for BookNova Project - Full Stack MERN Application_
