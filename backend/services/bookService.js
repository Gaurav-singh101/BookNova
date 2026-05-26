const db = require("../firebase");

const booksCollection = db.collection("books");

// Add new book
const addBook = async (bookData) => {
  const { url, title, author, price, desc, language } = bookData;
  
  const newBookRef = await booksCollection.add({
    url,
    title,
    author,
    price,
    desc,
    language,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return newBookRef.id;
};

// Get book by ID
const getBookById = async (bookId) => {
  const doc = await booksCollection.doc(bookId).get();
  
  if (!doc.exists) return null;
  
  return { id: doc.id, ...doc.data() };
};

// Get all books sorted by created date (newest first)
const getAllBooks = async () => {
  const snapshot = await booksCollection
    .orderBy("createdAt", "desc")
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get recent books (limited)
const getRecentBooks = async (limit = 4) => {
  const snapshot = await booksCollection
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update book
const updateBook = async (bookId, updateData) => {
  const { url, title, author, price, desc, language } = updateData;
  
  await booksCollection.doc(bookId).update({
    url,
    title,
    author,
    price,
    desc,
    language,
    updatedAt: new Date(),
  });
};

// Delete book
const deleteBook = async (bookId) => {
  await booksCollection.doc(bookId).delete();
};

module.exports = {
  addBook,
  getBookById,
  getAllBooks,
  getRecentBooks,
  updateBook,
  deleteBook,
};
