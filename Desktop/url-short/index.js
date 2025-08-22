const express = require("express");
const connectToMongoDB = require("./connect"); // ✅ no destructuring
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8001;

app.use(express.json()); // ✅ middleware for req.body

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("✅ Connected to MongoDB"));

app.use("/url", urlRoute);

app.listen(PORT, () => console.log(`🚀 Server started at port: ${PORT}`));
