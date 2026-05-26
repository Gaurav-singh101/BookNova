# Features Documentation - BookNova

## 📱 User Features

### Authentication

**Sign Up**

- Username must be > 3 characters
- Email must be unique and valid
- Password must be > 5 characters
- Password hashed with bcryptjs before storage
- Role automatically set to "user"

**Sign In**

- Username and password validation
- JWT token generated on successful login
- Token valid for 30 days
- Token stored in localStorage
- User role returned with token

**Logout**

- Removes token from localStorage
- Clears Redux auth state
- Redirects to home page
- All subsequent requests are unauthenticated

---

### Profile Management

**View Profile**

- Display username, email, address
- Show avatar image
- List cart items (count)
- List favorite items (count)
- Show order history

**Update Address**

- Change delivery address
- Validates non-empty input
- Updates user document in Firestore
- Immediate UI refresh

**View User Information**

- Protected endpoint (requires token)
- Returns all user data except password
- Includes cart, favorites, orders arrays
- Used to populate profile page

---

### Shopping Cart

**Add to Cart**

- Add any book from catalog
- Check if already in cart (no duplicates)
- Show feedback message
- Update cart count in navbar

**View Cart**

- Display all cart items with details
- Show title, author, price per item
- Calculate total price
- Show empty cart message if no items

**Remove from Cart**

- Remove specific book from cart
- Recalculate total price
- Update UI immediately
- Confirm removal with message

**Cart Persistence**

- Cart stored in Firestore (user.cart array)
- Persists across browser sessions
- Synced across devices for same account

---

### Favorites Management

**Add to Favorites**

- Add book from any page
- Check for duplicates
- Heart icon shows if favorited
- Show success message

**View Favorites**

- Display all favorite books
- Grid layout for browsing
- Click to view full details
- Remove option available

**Remove from Favorites**

- Remove from favorites list
- Update heart icon on book card
- Show confirmation message

---

### Order Management

**Place Order**

- Order all items in cart
- Create separate order for each book
- Set initial status: "Order Placed"
- Store with timestamp
- Clear cart after successful order

**View Order History**

- Show all user's orders (newest first)
- Display book info (title, author, price)
- Show order status
- Show order date/time
- Read-only view (user cannot edit)

**Order Status Values**

- "Order Placed" - Initial status
- "Out for delivery" - Admin assigned
- "Delivered" - Order completed
- "Canceled" - Order cancelled

---

## 🏢 Admin Features

### Book Management

**Add New Book**

- Admin-only operation
- Input: URL, title, author, price, description, language
- Validate all fields (required)
- Create new book document
- Auto-assign timestamp

**Update Book**

- Modify existing book details
- All fields editable
- Identified by bookId in header
- Update Firestore document
- Timestamp updated

**Delete Book**

- Remove book from catalog
- Cannot delete if no admin role
- Book stays in completed orders (historical)
- Bookid removed from all users' carts/favorites

**View All Books**

- Display all books sorted by newest first
- Grid layout
- Search/filter available on frontend
- Click for detailed view

---

### Order Management (Admin)

**View All Orders**

- See orders from all users
- Display user info, book info, status
- Sorted by newest first
- Read-only view with status update option

**Update Order Status**

- Change order status through dropdown
- Valid values: Order Placed, Out for delivery, Delivered, Canceled
- Update timestamp automatically
- Confirmation message shown
- User can see updated status in order history

**Order Analytics** (Future feature)

- Total orders count
- Orders by status
- Revenue calculation
- Top books ordered

---

## 🎨 UI/UX Features

### Responsive Design

**Mobile (< 768px)**

- Single column layout
- Hamburger menu for navigation
- Full-width cards
- Touch-optimized buttons
- Stack all elements vertically

**Tablet (768px - 1024px)**

- Two column layout
- Sidebar visible
- Card grid: 2 columns
- Optimized spacing

**Desktop (> 1024px)**

- Full layout with sidebars
- 3-4 column grid
- Maximum content visibility
- Hover effects on interactive elements

---

### Navigation

**Navbar Features**

- Logo/home link
- Search box (if implemented)
- Cart icon with item count
- User menu (dropdown)
- Admin menu (if admin role)
- Mobile menu toggle

**Conditional Navigation**

- Different items based on authentication status
- Admin-only pages hidden from regular users
- Login/Signup buttons for guests
- Profile link for logged-in users

**Nested Routes**

- Profile → Favorites
- Profile → Order History
- Profile → Settings
- Profile → All Orders (admin)
- Profile → Add/Update Book (admin)

---

### Visual Feedback

**Loading States**

- Spinner shows while fetching data
- Prevents user interaction during load
- Removed after data arrives

**Error Messages**

- Clear error messages for failed operations
- Validation feedback on forms
- API error responses shown to user
- 404 page for missing routes

**Success Messages**

- Confirmation after add to cart
- Confirmation after placing order
- Confirmation after profile update
- Toast notifications (if implemented)

**Empty States**

- "Cart is empty" message
- "No orders yet" message
- "No favorites yet" message
- Call-to-action button to browse

---

## 🔐 Security Features

### Authentication

- JWT token-based authentication
- Password hashing with bcryptjs
- Token stored in localStorage
- Token included in all protected requests
- Token expiration: 30 days
- Server verifies token on each request

### Authorization

- Role-based access control (user/admin)
- Protected routes require token
- Admin operations check user role
- User operations check ownership
- Prevent unauthorized access with middleware

### Data Protection

- Passwords never returned in API responses
- Sensitive data excluded from responses
- CORS configured for frontend domain
- Firebase Security Rules on Firestore
- Secure .env file for secrets

---

## 📊 Performance Features

### Optimization Techniques

- Lazy loading for images
- Efficient Firestore queries with indexes
- Service layer for code reuse
- Memoization of components (if React.memo used)
- Debouncing for search (if implemented)

### Caching

- Browser caches images
- Redux stores user state
- Firestore automatic caching
- API responses may be cached

---

## 🎯 User Workflows

### New User Workflow

```
1. Visit website
2. Click "Sign Up"
3. Enter username, email, password, address
4. Confirm signup
5. Redirected to login
6. Enter credentials
7. Token received
8. Redirected to home
9. Browse books
10. Add to cart or favorites
```

### Shopping Workflow

```
1. Browse all books
2. Click book for details
3. Add to cart
4. Continue shopping or go to cart
5. Review items and total
6. Place order
7. Order confirmation
8. See "Order Placed" status
9. Wait for admin to process
```

### Admin Workflow

```
1. Login with admin account
2. Navigate to admin panel
3. Add/update/delete books
4. View all orders
5. Update order status
6. Monitor inventory
7. Track sales
```

---

## 🚀 Current Status

### ✅ Implemented Features

- User authentication (signup/login/logout)
- Book browsing and details
- Shopping cart functionality
- Favorites management
- Order placement and history
- Admin book management
- Admin order management
- Address management
- Role-based access control
- Responsive design
- 51 books pre-seeded

### ⏳ Future Features

- Search and filtering
- Book reviews and ratings
- Payment gateway integration
- Email notifications
- Wishlist separate from favorites
- Book recommendations
- User ratings visibility
- Order tracking with real-time updates
- Admin dashboard with analytics
- Image upload for books
- Password reset functionality

---

## 📈 Feature Statistics

| Category               | Count | Status      |
| ---------------------- | ----- | ----------- |
| API Endpoints          | 15+   | ✅ Complete |
| Frontend Pages         | 10+   | ✅ Complete |
| User Features          | 8     | ✅ Complete |
| Admin Features         | 2     | ✅ Complete |
| Books in Catalog       | 51    | ✅ Seeded   |
| Responsive Breakpoints | 3     | ✅ Complete |
| Security Features      | 4     | ✅ Complete |
