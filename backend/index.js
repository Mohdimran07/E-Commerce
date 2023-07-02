import express from "express";
import dotenv from 'dotenv';
dotenv.config()
import products from "./data/products.js";
const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => {
  res.send("server running...");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});
app.get("/api/product/:id", (req, res) => {
    const product = products.find((p) => p._id === req.params.id)
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
