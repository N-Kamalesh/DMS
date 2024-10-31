import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "You hit the dms api route!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
