const db = require("../firebase");

const usersCollection = db.collection("users");

// Helper function to check unique fields
const isUsernameUnique = async (username, excludeUid = null) => {
  const query = usersCollection.where("username", "==", username);
  const snapshot = await query.get();
  
  if (snapshot.empty) return true;
  if (excludeUid) {
    return snapshot.docs.every(doc => doc.id !== excludeUid);
  }
  return false;
};

const isEmailUnique = async (email, excludeUid = null) => {
  const query = usersCollection.where("email", "==", email);
  const snapshot = await query.get();
  
  if (snapshot.empty) return true;
  if (excludeUid) {
    return snapshot.docs.every(doc => doc.id !== excludeUid);
  }
  return false;
};

// Create new user
const createUser = async (userData) => {
  const { username, email, password, address } = userData;
  
  const newUserRef = await usersCollection.add({
    username,
    email,
    password,
    address,
    avatar: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    role: "user",
    favourites: [],
    cart: [],
    orders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return newUserRef.id;
};

// Get user by username
const getUserByUsername = async (username) => {
  const query = usersCollection.where("username", "==", username);
  const snapshot = await query.get();
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// Get user by ID
const getUserById = async (userId) => {
  const doc = await usersCollection.doc(userId).get();
  
  if (!doc.exists) return null;
  
  return { id: doc.id, ...doc.data() };
};

// Get user by ID without password
const getUserByIdWithoutPassword = async (userId) => {
  const user = await getUserById(userId);
  
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Update user address
const updateUserAddress = async (userId, address) => {
  await usersCollection.doc(userId).update({
    address,
    updatedAt: new Date(),
  });
};

// Add book to favourites
const addToFavourites = async (userId, bookId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const favourites = user.favourites || [];
  
  if (favourites.includes(bookId)) {
    return { alreadyExists: true };
  }
  
  await usersCollection.doc(userId).update({
    favourites: [...favourites, bookId],
    updatedAt: new Date(),
  });
  
  return { alreadyExists: false };
};

// Remove book from favourites
const removeFromFavourites = async (userId, bookId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const favourites = user.favourites || [];
  
  await usersCollection.doc(userId).update({
    favourites: favourites.filter(id => id !== bookId),
    updatedAt: new Date(),
  });
};

// Get user favourites with book details
const getUserFavourites = async (userId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const favourites = user.favourites || [];
  const bookService = require("./bookService");
  
  const favouriteBooks = await Promise.all(
    favourites.map(bookId => bookService.getBookById(bookId))
  );
  
  return favouriteBooks.filter(book => book !== null);
};

// Add book to cart
const addToCart = async (userId, bookId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const cart = user.cart || [];
  
  if (cart.includes(bookId)) {
    return { alreadyExists: true };
  }
  
  await usersCollection.doc(userId).update({
    cart: [...cart, bookId],
    updatedAt: new Date(),
  });
  
  return { alreadyExists: false };
};

// Remove book from cart
const removeFromCart = async (userId, bookId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const cart = user.cart || [];
  
  await usersCollection.doc(userId).update({
    cart: cart.filter(id => id !== bookId),
    updatedAt: new Date(),
  });
};

// Get user cart with book details
const getUserCart = async (userId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const cart = user.cart || [];
  const bookService = require("./bookService");
  
  const cartBooks = await Promise.all(
    cart.map(bookId => bookService.getBookById(bookId))
  );
  
  return cartBooks.filter(book => book !== null).reverse();
};

// Add order to user orders
const addOrder = async (userId, orderId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const orders = user.orders || [];
  
  await usersCollection.doc(userId).update({
    orders: [...orders, orderId],
    updatedAt: new Date(),
  });
};

// Remove items from cart
const clearCartItems = async (userId, bookIds) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const cart = user.cart || [];
  const updatedCart = cart.filter(id => !bookIds.includes(id));
  
  await usersCollection.doc(userId).update({
    cart: updatedCart,
    updatedAt: new Date(),
  });
};

// Get user orders with details
const getUserOrders = async (userId) => {
  const user = await getUserById(userId);
  
  if (!user) throw new Error("User not found");
  
  const orders = user.orders || [];
  const orderService = require("./orderService");
  
  const userOrders = await Promise.all(
    orders.map(orderId => orderService.getOrderById(orderId))
  );
  
  return userOrders.filter(order => order !== null).reverse();
};

module.exports = {
  isUsernameUnique,
  isEmailUnique,
  createUser,
  getUserByUsername,
  getUserById,
  getUserByIdWithoutPassword,
  updateUserAddress,
  addToFavourites,
  removeFromFavourites,
  getUserFavourites,
  addToCart,
  removeFromCart,
  getUserCart,
  addOrder,
  clearCartItems,
  getUserOrders,
};
