import Cart from "../models/cart.model.js";

export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", cartId: newCart._id });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "No se pudo crear el carrito" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res
      .status(200)
      .json({ products: cart.products, message: "Lista de productos" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

export const getProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();

    res.status(200).json({ cart, message: "Nuevo producto añadido" });
  } catch (error) {
    res.status(500).json({ error: "Error al añadir producto al carrito" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      (product) => product.product.toString() !== pid
    );

    await cart.save();

    res
      .status(200)
      .json({ carts: cart, message: "Producto eliminado del carrito" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};

export const deleteAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = [];

    await cart.save();

    res.status(200).json({
      carts: cart,
      message: "Todos los productos fueron eliminados del carrito",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar los productos del carrito" });
  }
};
