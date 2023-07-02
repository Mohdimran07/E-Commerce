import express from "express";
import products from "./data/products.js";
const PORT = 8000;

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
