const router = require("express").Router() ; 
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");


// Add book to favourite

router.put("/add-book-to-favourite" , authenticateToken , async (req , res) => {
    try{
        const{ bookid , id } = req.headers ; 
        const userData = await User.findById(id) ; 
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message: "Book is Already in Favourites "});
        }
        await User.findByIdAndUpdate(id , {$push: {favourites: bookid} });
        return res.status(200).json({message: "Book Added Favourites "});
    }catch(error){
        res.status(500).json({message : "Internal server error"});
    }
});



// Delete book from favourite

router.put("/remove-book-from-favourite" , authenticateToken , async (req , res) => {
    try{
        const{ bookid , id } = req.headers ; 
        const userData = await User.findById(id) ; 
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id , {$pull : {favourites: bookid} });
        }
        return res.status(200).json({message: "Book removed Favourites "});
    }catch(error){
        res.status(500).json({message : "Internal server error"});
    }
})


// Get Favourite books of particular user
router.get("/get-favourite-books" , authenticateToken , async (req , res) => {
    try{
        const{ id } = req.headers ; 
        const userData = await User.findById(id).populate("favourites") ; 

        const favouriteBooks = userData.favourites ;

        return res.json({
            status: "Success" , 
            data: favouriteBooks ,
    });

    }catch(error){
        res.status(500).json({message : "An error occured "});
    }
});



module.exports = router ;