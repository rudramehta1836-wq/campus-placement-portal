require("dotenv").config();
const connectDB = require("./config/db");
const express=require('express');
const app = express();
const port=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send(`Welcome to campus placement portal`);
});
connectDB();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});