import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/products.json";
  }

  generateId = (products) =>
    products.length > 0 ? products[products.length - 1].id + 1 : 1;

  // Obtener todos los productos
  getProducts = async () => {
    const productsJson = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(productsJson);
    return products;
  };

  // Obtener un producto por su id
  getProductById = async (productId) => {
    const productsJson = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(productsJson);
    const product = products.find(
      (productData) => productData.id === Number(productId)
    );
    return product;
  };

  // Agregar un producto
  addProduct = async (newProduct) => {
    const productsJson = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(productsJson);
    const id = this.generateId(products);
    products.push({ id, ...newProduct });
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    return products;
  };

  // Actualiza los datos de un producto por su id
  updateProductById = async (productId, updatedData) => {
    const productsJson = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(productsJson);
    const index = products.findIndex(
      (product) => product.id === Number(productId)
    );
    products[index] = { ...products[index], ...updatedData };
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    return products;
  };

  // Elimina usuario por su id
  deleteProductById = async (productId) => {
    const productsJson = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(productsJson);
    const productsFilter = products.filter(
      (productData) => productData.id !== Number(productId)
    );
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productsFilter, null, 2),
      "utf-8"
    );
    return productsFilter;
  };
}

export default ProductManager;
