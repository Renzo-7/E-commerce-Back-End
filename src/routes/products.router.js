import { Router } from "express";
import {
  getProducts,
  getProductsbyId,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

// Obtener todos los productos
router.get("/", getProducts);

// Obtener producto por ID
router.get("/:pid", getProductsbyId);

// Agregar un producto
router.post("/", addProduct);

// Actualizar un producto
router.put("/:pid", updateProduct);

// Eliminar un producto
router.delete("/:pid", deleteProduct);

export default router;
