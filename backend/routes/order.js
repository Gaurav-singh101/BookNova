const router = require("express").Router() ; 
const { authenticateToken } = require("./userAuth") ; 
const userService = require("../services/userService");
const orderService = require("../services/orderService");

// Place Order


router.post("/place-order" , authenticateToken , async (req , res ) => {
    try{
        const {id} = req.headers ;  
        const { order } = req.body ; 

        for(const orderData of order){
            const orderId = await orderService.createOrder(id, orderData._id || orderData.id);

            await userService.addOrder(id, orderId);
            await userService.removeFromCart(id, orderData._id || orderData.id);
        }

        return res.json({
            status: "Success" , 
            message: "Order Placed Successfully" , 
        });
    } catch (error) {
        console.log(error) ; 
        return res.status(500).json({message : "An error Occured "});
    }
});

// Get Order history 

router.get("/get-order-history" , authenticateToken , async (req , res ) => {
    try{
        const {id} = req.headers ;  
        const ordersData = await userService.getUserOrders(id);

        return res.json({
            status: "Success" , 
            data: ordersData ,
        });

    } catch (error) {
        console.log(error) ; 
        return res.status(500).json({message : "An error Occured "});
    }
});


// Get - all - orders -- admin  

router.get("/get-all-orders" , authenticateToken , async (req , res ) => {
    try{
        const userData = await orderService.getAllOrders();

        return res.json({
            status: "Success" , 
            data: userData ,
        });

    } catch (error) {
        console.log(error) ; 
        return res.status(500).json({message : "An error Occured "});
    }
});


// Update order -- admin 

router.put("/update-status/:id" , authenticateToken , async (req , res ) => {
    try{
        const { id } = req.params ; 
        await orderService.updateOrderStatus(id, req.body.status);
        
        return res.json({
            status : "Success" , 
            message : "Status Updated Successfully" , 
        });
    } catch (error) {
        console.log(error) ; 
        return res.status(500).json({message : "An error Occured "});
    }
});

module.exports = router; 