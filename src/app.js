import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager();

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Endpoints
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

// Socket.IO
io.on("connection", (socket) => {
  socket.on("getProducts", async () => {
    const products = await productManager.getProducts();
    socket.emit("products", products);
  });
  socket.on("addProduct", async (data) => {
    await productManager.addProduct(data);
    io.emit("products", await productManager.getProducts());
  });
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProductById(id);
    io.emit("products", await productManager.getProducts());
  });
});

// Server
const PORT = 8080;
server.listen(PORT, () => {
  console.log("Servidor iniciado en puerto ", PORT);
});
