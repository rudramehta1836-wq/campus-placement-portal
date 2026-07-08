require("dotenv").config();
const studentRoutes = require("./routes/studentRoutes");
const connectDB = require("./config/db");
const express=require('express');
const app = express();
const port=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send(`Welcome to campus placement portal`);
});
connectDB();
app.use(express.json());
app.use("/api/students",studentRoutes);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});