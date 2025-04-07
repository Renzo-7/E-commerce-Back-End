import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager();
const cartManager = new CartManager();

//endpoints

//rutas /api/products
app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json({ products, message: "Lista de productos" });
});

app.get("/api/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const products = await productManager.getProductById(productId);
  res.status(200).json({ products, message: "Producto según id" });
});

app.post("/api/products", async (req, res) => {
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
  const products = await productManager.addProduct(newProduct);
  res.status(201).json({ products, message: "Nuevo producto agregado" });
});

app.put("/api/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const updatedData = req.body;
  const products = await productManager.updateProductById(
    productId,
    updatedData
  );
  res.status(200).json({ products, message: "Producto actualizado" });
});

app.delete("/api/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const products = await productManager.deleteProductById(productId);
  res.status(200).json({ products, message: "Producto eliminado" });
});

//rutas /api/carts
app.post("/api/carts", async (req, res) => {
  const carts = await cartManager.addCart();
  res.status(201).json({ carts, message: "Nuevo carrito creado" });
});

app.get("/api/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  const products = await cartManager.getProductsInCartById(cid);
  res.status(200).json({ products, message: "Lista de productos" });
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = parseInt(req.params.pid);
  const quantity = req.body.quantity;

  const carts = await cartManager.addProductInCart(cid, pid, quantity);
  res.status(200).json({ carts, messag: "Nuevo producto añadido" });
});

app.listen(8080, () => {
  console.log("Servidor iniciado en puerto 8080");
});
