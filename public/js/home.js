document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("addToCartHome")) {
    const productId = e.target.getAttribute("data-id");
    const cartId = "682605b175bef82f3a282bf4"; // ID CARRITO HARDCODEADO SEPAN DICULPAR

    try {
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: 1 }),
        }
      );

      if (response.ok) {
        console.log(`Producto ${productId} agregado al carrito`);
        alert("Producto agregado al carrito");
      } else {
        const error = await response.json();
        console.error("Error al agregar al carrito:", error);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }
});
