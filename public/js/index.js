const socket = io();

// Conectarse al servidor WebSocket
socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket");
  const cartId = localStorage.getItem("cartId");
  socket.emit("getCart", cartId);
  socket.emit("getProducts");
});

// Solo un socket.on para products
socket.on("products", (products) => {
  console.log("Productos recibidos:", products);
  renderProducts(products);
});

const cartId = "682605b175bef82f3a282bf4"; // ID CARRITO HARDCODEADO SEPAN DICULPAR
socket.emit("getCart", cartId);

socket.on("updateCart", (cart) => {
  renderCart(cart);
});

// Función para obtener el carrito actualizado
async function fetchUpdatedCart(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`);
    const data = await response.json();
    if (data.carts) {
      renderCart(data.carts); // Actualiza la interfaz con el carrito
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
  }
}

// Función para renderizar el carrito
function renderCart(cart) {
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  cart.products.forEach((product) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `
      <strong>${product.product.title}</strong><br />
      Cantidad: ${product.quantity} <br />
      Precio: $${product.product.price}
      <button class="removeProduct" data-id="${product.product._id}">Eliminar</button>
    `;
    cartList.appendChild(li);
  });
}

// Agregar producto al carrito
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("addToCart")) {
    const productId = e.target.getAttribute("data-id");
    const cartId =
      e.target.getAttribute("data-cartid") || "682605b175bef82f3a282bf4"; // ID CARRITO HARDCODEADO SEPAN DICULPAR

    // Buscar el input de cantidad asociado al producto
    const quantityInput = document.querySelector(
      `.quantity-input[data-product-id="${productId}"]`
    );
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    try {
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: quantity > 0 ? quantity : 1 }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Producto agregado correctamente:", data);
        alert("Producto agregado al carrito");
      } else {
        const error = await response.json();
        console.error("Error al agregar al carrito:", error);
        alert("Error al agregar producto al carrito");
      }
    } catch (error) {
      console.error("Error de red al agregar producto:", error);
      alert("Error de red al agregar producto");
    }
  }
});

// Eliminar producto del carrito
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("removeProduct")) {
    const productId = e.target.getAttribute("data-id");
    const cartId = "682605b175bef82f3a282bf4"; // ID CARRITO HARDCODEADO SEPAN DICULPAR

    try {
      const response = await fetch(
        `/api/carts/${cartId}/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Producto ${productId} eliminado del carrito`);
        // Opcional: actualizar el carrito en pantalla
        e.target.parentElement.remove(); // elimina el li del producto en el DOM
      } else {
        const error = await response.json();
        console.error("Error al eliminar producto:", error);
      }
    } catch (error) {
      console.error("Error de red al eliminar producto:", error);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cartLink = document.getElementById("cartLink");
  const cartId = "682605b175bef82f3a282bf4"; // ID CARRITO HARDCODEADO SEPAN DICULPAR

  if (cartLink) {
    if (cartId) {
      cartLink.href = `/carts/${cartId}`;
    } else {
      cartLink.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Todavía no has agregado productos al carrito.");
      });
    }
  }
});

document.getElementById("emptyCartBtn").addEventListener("click", async () => {
  const cartId = "682605b175bef82f3a282bf4"; // tu cart ID hardcodeado o dinámico

  try {
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Carrito vaciado correctamente");
      // Actualizá la interfaz para mostrar que el carrito está vacío
      const cartList = document.getElementById("cartList");
      cartList.innerHTML =
        "<li class='list-group-item'>El carrito está vacío.</li>";
    } else {
      const error = await response.json();
      console.error("Error al vaciar el carrito:", error);
    }
  } catch (error) {
    console.error("Error de red al vaciar carrito:", error);
  }
});
