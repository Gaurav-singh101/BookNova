const router = require("express").Router();
const userService = require("../services/userService");
const bookService = require("../services/bookService");
const {authenticateToken} = require("./userAuth");

// add - book 

router.post("/add-book" , authenticateToken , async (req , res) => {
    try{
        const { id } = req.headers ; 

        const user = await userService.getUserById(id);

        if(!user || user.role !== "admin"){
            return res.status(400).json({message: "You are not have access to perform admin work"});
        }

        const bookId = await bookService.addBook({
            url: req.body.url , 
            title: req.body.title , 
            author: req.body.author , 
            price: req.body.price , 
            desc: req.body.desc , 
            language: req.body.language , 
        });

        res.status(200).json({message: "Book added successfully", id: bookId})
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Update - Book 

router.put("/update-book" , authenticateToken , async (req , res) => {
    try{

        const { bookid } = req.headers ; 

        await bookService.updateBook(bookid, {
            url: req.body.url , 
            title: req.body.title , 
            author: req.body.author , 
            price: req.body.price , 
            desc: req.body.desc , 
            language: req.body.language , 
        });

        return res.status(200).json({message: "Book Updated successfully"});   
    } catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
});


router.delete("/delete-book" , authenticateToken , async (req ,res) => {
    try{
        const{ bookid } = req.headers ; 
        await bookService.deleteBook(bookid);
        return res.status(200).json({
            message: "Book deleted Successfully !" ,
        });
    }   catch (error){
            console.log(error);
            return res.status(500).json({ message: "An error Occured "});
        }
});




router.get("/get-all-books" , async (req , res) => {
    try{
        const books = await bookService.getAllBooks();
        return res.json({
            status: "Success" , 
            data: books ,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "An error occured"});
    }
});

router.get("/get-recent-books" , async (req , res) => {
    try{
        const books = await bookService.getRecentBooks(4);
        return res.json({
            status: "Success" , 
            data: books ,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "An error occured"});
    }
});

router.get("/get-book-by-id/:id" , async (req , res) => {
    try{
        const {id} = req.params ; 
        const book = await bookService.getBookById(id);
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        return res.json({
            status: "Success" , 
            data: book ,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message : "An error occured"});
    }
});

module.exports = router; 