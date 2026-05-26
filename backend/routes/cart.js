const router = require("express").Router();
const userService = require("../services/userService");
const {authenticateToken} = require("./userAuth");

// Put book to cart 

router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers; 
        
        const result = await userService.addToCart(id, bookid);
        
        if (result.alreadyExists) {
            return res.json({
                status: "Success",
                message: "Book is already in cart",
            });
        }

        return res.json({
            status: "Success",
            message: "Book added to cart",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params;
        const { id } = req.headers; 

        await userService.removeFromCart(id, bookid);

        return res.json({
            status: "Success",
            message: "Book removed from cart",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


router.get("/get-user-cart" , authenticateToken , async (req , res) => {
    try{
        const{ id } = req.headers ; 
        const cart = await userService.getUserCart(id);

        return res.json({
            status: "Success" , 
            data: cart ,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message : "An error occured "});
    }
});

module.exports = router;