import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import connectMongoDB from "./config/db.js";
import Product from "./models/product.model.js";
import Cart from "./models/cart.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

connectMongoDB();

// Endpoints
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

// Websockets
io.on("connection", (socket) => {
  // Enviar productos actuales al conectarse
  socket.on("getProducts", async () => {
    const products = await Product.find();
    socket.emit("products", products);
  });

  // Agregar producto
  socket.on("addProduct", async (productData) => {
    const newProduct = await Product.create(productData);
    socket.emit("productAdded", newProduct);
    const products = await Product.find();
    io.emit("products", products);
  });

  // Eliminar producto
  socket.on("deleteProduct", async (productId) => {
    await Product.findByIdAndDelete(productId);
    const products = await Product.find();
    io.emit("products", products);
  });

  // Escuchar la solicitud de carrito
  socket.on("getCart", async (cartId) => {
    try {
      const cart = await Cart.findById(cartId).populate("products.product");
      if (cart) {
        socket.emit("updateCart", cart);
      } else {
        socket.emit("error", "Carrito no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  });

  // Escuchar evento de eliminar producto del carrito
  socket.on("deleteProduct", async ({ cartId, productId }) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        socket.emit("error", "Carrito no encontrado");
        return;
      }

      cart.products = cart.products.filter(
        (product) => product.product.toString() !== productId
      );

      await cart.save();

      // Actualizar carrito solo al usuario actual
      socket.emit("updateCart", cart);
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      socket.emit("error", "Error al eliminar producto del carrito");
    }
  });
});

// Server
const PORT = 8080;
server.listen(PORT, () => {
  console.log("Servidor iniciado en puerto:", PORT);
});
