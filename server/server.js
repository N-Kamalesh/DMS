import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGO_URI);
const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
