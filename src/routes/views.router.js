import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query; // Utilizo solo 3 en limit para que haya nextPage y prevPage

    const result = await Product.paginate(
      {},
      {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
      }
    );

    res.render("home", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
    });
  } catch (error) {
    res.status(500).send("Error al obtener productos para la vista home");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send("Error al cargar la vista en tiempo real");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cartDetail", { cart });
  } catch (error) {
    console.error("Error al renderizar el carrito:", error);
    res.status(500).send("Error interno al renderizar el carrito");
  }
});

export default router;
