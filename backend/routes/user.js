const router = require("express").Router();
const userService = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");

// Sign up

router.post("/sign-up" , async(req , res) => {
    try{
        const { username , email , password , address } = req.body ;

        // Check username length is more than 4 

        if (username.length <= 3) { 
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }
        

        // Check username already exits ? 

        const usernameUnique = await userService.isUsernameUnique(username);
        if (!usernameUnique) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        const emailUnique = await userService.isEmailUnique(email);
        if (!emailUnique) {
            return res.status(400).json({ message: "Email already exists" });
        }
        


        // Check password length 

        if(password.length <= 5){
            return res
            .status(400)
            .json({message:"Password length should be greater than 5"});
        }

        const hashPass = await bcrypt.hash(password , 10); 

        const userId = await userService.createUser({
            username,
            email,
            password: hashPass,
            address,
        });

        return res.status(200).json({message: "SignUp Successfully"});

    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
})

// Sign in 

router.post("/sign-in" , async(req , res) => {
    try{
        const{username , password} = req.body ;

        const existingUser = await userService.getUserByUsername(username);
        if(!existingUser){
            return res.status(400).json({message: "Invalid credentials"});
        }

        await bcrypt.compare(password , existingUser.password , (err , data) => {
            if(data){
                const authClaims = [
                    {name:existingUser} , 
                    {role:existingUser.role} ,
                ]
                const token = jwt.sign({authClaims} , "bookStore123" , {
                    expiresIn: "30d" , 
                });

                res.status(200).json({ id: existingUser.id , role: existingUser.role , token});   
            }else{
                res.status(400).json({message: "Invalid credentials"});   
            }
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
})


// Get user information 

router.get("/get-user-information" , authenticateToken , async(req , res) => {
    try{
        const {id} = req.headers;
        const data = await userService.getUserByIdWithoutPassword(id);
        
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json(data);
    } catch(error){
        console.error(error);
        res.status(500).json({message : "Internal server error"});
    }
});


// Update Address 

router.put("/update-address" , authenticateToken , async(req , res) => {
    try{
        const {id} = req.headers;
        const {address} = req.body ;
        
        await userService.updateUserAddress(id, address);
        return res.status(200).json({message : "Adress updated successfully"}); 

    } catch(error){
        console.error(error);
        res.status(500).json({message : "Internal server error"});
    }
})
  


module.exports = router; 