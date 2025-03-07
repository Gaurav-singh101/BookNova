const express = require("express");
require("dotenv").config(); 

const app = express();
require("./conn/conn");  

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server Started on Port ${process.env.PORT}`);
});
