const router = require("express").Router() ; 
const userService = require("../services/userService");
const { authenticateToken } = require("./userAuth");


// Add book to favourite

router.put("/add-book-to-favourite" , authenticateToken , async (req , res) => {
    try{
        const{ bookid , id } = req.headers ; 
        
        const result = await userService.addToFavourites(id, bookid);
        
        if (result.alreadyExists) {
            return res.status(200).json({message: "Book is Already in Favourites "});
        }
        
        return res.status(200).json({message: "Book Added Favourites "});
    }catch(error){
        console.error(error);
        res.status(500).json({message : "Internal server error"});
    }
});



// Delete book from favourite

router.put("/remove-book-from-favourite" , authenticateToken , async (req , res) => {
    try{
        const{ bookid , id } = req.headers ; 
        
        await userService.removeFromFavourites(id, bookid);
        return res.status(200).json({message: "Book removed Favourites "});
    }catch(error){
        console.error(error);
        res.status(500).json({message : "Internal server error"});
    }
})


// Get Favourite books of particular user
router.get("/get-favourite-books" , authenticateToken , async (req , res) => {
    try{
        const{ id } = req.headers ; 
        const favouriteBooks = await userService.getUserFavourites(id);

        return res.json({
            status: "Success" , 
            data: favouriteBooks ,
        });

    }catch(error){
        console.error(error);
        res.status(500).json({message : "An error occured "});
    }
});



module.exports = router;