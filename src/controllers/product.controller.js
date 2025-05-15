import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const products = await Product.paginate({}, { limit, page });
    res.status(200).json({ status: "success", payload: products });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", error: "Error al obtener productos" });
  }
};

export const getProductsbyId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", error: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", error: "Error al obtener el producto" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ status: "success", payload: savedProduct });
  } catch (error) {
    res.status(400).json({ status: "error", error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: "error", error: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", error: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "error", error: "Producto no encontrado" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Producto eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", error: "Error al eliminar producto" });
  }
};
