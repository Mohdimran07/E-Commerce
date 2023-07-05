import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import colors from "colors";
import productRoutes from "./routes/productRoutes.js";
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("server running...");
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
