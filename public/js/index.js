const socket = io();

// Solicitar productos iniciales
socket.emit("getProducts");

// Recibir y mostrar productos
socket.on("products", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>ID:</strong> ${product.id} <br>
      <strong>Título:</strong> ${product.title} <br>
      <strong>Precio:</strong> $${product.price} <br>
      <strong>Categoría:</strong> ${product.category} 
      <button class="deleteProduct" data-id="${product.id}">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});

// Enviar evento para agregar producto
document.getElementById("addProductForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const newProduct = {
    title: form.title.value,
    description: form.description.value,
    code: form.code.value,
    price: Number(form.price.value),
    stock: Number(form.stock.value),
    category: form.category.value,
    thumbnails: form.thumbnails.value
      ? form.thumbnails.value.split(",").map((s) => s.trim())
      : [],
  };
  socket.emit("addProduct", newProduct);
  form.reset();
});

// Eliminar producto
document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteProduct")) {
    const productId = e.target.getAttribute("data-id");
    socket.emit("deleteProduct", productId);
  }
});
