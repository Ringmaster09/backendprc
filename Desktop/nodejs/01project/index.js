const express = require("express");

const app = express();
const PORT = 8000;

//routes

app.listen(PORT,()=>console.log(`Server started at port 8000`))