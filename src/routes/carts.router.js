import { Router } from "express";
import {
  createCart,
  getCartById,
  getProductToCart,
  deleteProductFromCart,
  deleteAllProductsFromCart,
} from "../controllers/cart.controller.js";

const router = Router();

// Crear un nuevo carrito vacío
router.post("/", createCart);

// Obtener los productos de un carrito
router.get("/:cid", getCartById);

// Agregar un producto al carrito (o incrementar cantidad si ya está)
router.post("/:cid/product/:pid", getProductToCart);

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", deleteProductFromCart);

// Eliminar todos los productos del carrito
router.delete("/:cid", deleteAllProductsFromCart);

export default router;
