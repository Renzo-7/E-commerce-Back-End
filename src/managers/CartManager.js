import fs from "fs";

class CartManager {
  constructor() {
    this.path = "./src/carts.json";
  }

  generateNewId = (carts) =>
    carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

  addCart = async () => {
    const cartsJson = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(cartsJson);

    const id = this.generateNewId(carts);
    carts.push({ id, products: [] });

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2),
      "utf-8"
    );
    return carts;
  };

  getProductsInCartById = async (cid) => {
    const cartsJson = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(cartsJson);

    const cart = carts.find((cartData) => cartData.id == cid);
    return cart.products;
  };

  addProductInCart = async (cid, pid, quantity) => {
    const cartsJson = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(cartsJson);

    carts.forEach((cart) => {
      if (cart.id == cid) {
        const existingProduct = cart.products.find((p) => p.id == pid);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ id: pid, quantity });
        }
      }
    });

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2),
      "utf-8"
    );

    return carts;
  };
}

export default CartManager;
