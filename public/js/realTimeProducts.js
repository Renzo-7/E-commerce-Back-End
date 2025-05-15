// Función que renderiza los productos en el DOM
function renderProducts(products) {
  const productList = document.getElementById("productList");
  if (!productList) {
    // Si no existe el contenedor de productos, no hacemos nada
    return;
  }
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>ID:</strong> ${product._id} <br>
      <strong>Título:</strong> ${product.title} <br>
      <strong>Precio:</strong> $${product.price} <br>
      <strong>Categoría:</strong> ${product.category} 
      <button class="deleteProduct" data-id="${product._id}">Eliminar</button>
    `;
    productList.appendChild(li);
  });
}

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

// Enviar evento para eliminar producto
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteProduct")) {
    const productId = e.target.getAttribute("data-id");

    if (!productId) {
      console.error("ID no definido");
      return;
    }

    socket.emit("deleteProduct", productId);
  }
});
