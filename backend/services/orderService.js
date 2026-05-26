const db = require("../firebase");

const ordersCollection = db.collection("orders");
const booksCollection = db.collection("books");
const usersCollection = db.collection("users");

// Create new order
const createOrder = async (userId, bookId) => {
  const newOrderRef = await ordersCollection.add({
    user: userId,
    book: bookId,
    status: "Order Placed",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return newOrderRef.id;
};

// Get order by ID with book and user details
const getOrderById = async (orderId) => {
  const doc = await ordersCollection.doc(orderId).get();
  
  if (!doc.exists) return null;
  
  const orderData = { id: doc.id, ...doc.data() };
  
  // Fetch book details
  if (orderData.book) {
    const bookDoc = await booksCollection.doc(orderData.book).get();
    if (bookDoc.exists) {
      orderData.book = { id: bookDoc.id, ...bookDoc.data() };
    }
  }
  
  // Fetch user details
  if (orderData.user) {
    const userDoc = await usersCollection.doc(orderData.user).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const { password, ...userWithoutPassword } = userData;
      orderData.user = { id: userDoc.id, ...userWithoutPassword };
    }
  }
  
  return orderData;
};

// Get all orders with book and user details
const getAllOrders = async () => {
  const snapshot = await ordersCollection
    .orderBy("createdAt", "desc")
    .get();
  
  const orders = [];
  
  for (const doc of snapshot.docs) {
    const orderData = { id: doc.id, ...doc.data() };
    
    // Fetch book details
    if (orderData.book) {
      const bookDoc = await booksCollection.doc(orderData.book).get();
      if (bookDoc.exists) {
        orderData.book = { id: bookDoc.id, ...bookDoc.data() };
      }
    }
    
    // Fetch user details
    if (orderData.user) {
      const userDoc = await usersCollection.doc(orderData.user).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const { password, ...userWithoutPassword } = userData;
        orderData.user = { id: userDoc.id, ...userWithoutPassword };
      }
    }
    
    orders.push(orderData);
  }
  
  return orders;
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ["Order Placed", "Out for delivery", "Delivered", "Canceled"];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }
  
  await ordersCollection.doc(orderId).update({
    status,
    updatedAt: new Date(),
  });
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
