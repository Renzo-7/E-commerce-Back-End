import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// GET /api/products
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json({ products });
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductsById(req.params.pid);
  res.status(200).json({ product });
});

// POST /api/products
router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  } = req.body;
  if (
    !title ||
    !description ||
    !code ||
    price == null ||
    stock == null ||
    !category
  ) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }
  const newProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  const product = await productManager.addProduct(newProduct);
  res.status(201).json({ product });
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  const updated = await productManager.updateProductById(
    req.params.pid,
    req.body
  );
  res.status(200).json({ updated });
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  const deleted = await productManager.deleteProductById(req.params.pid);
  res.status(200).json({ deleted });
});

export default router;
