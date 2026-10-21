// 1. Catálogo inicial de 12 productos para LUMEN
const productosIniciales = [
  { id: 1, nombre: "Tira LED Cálida 2700K", categoria: "Tiras LED", precio: 1500, stock: 10 },
  { id: 2, nombre: "Tira LED RGB Neón", categoria: "Tiras LED", precio: 2500, stock: 8 },
  { id: 3, nombre: "Tira LED Fría 6500K", categoria: "Tiras LED", precio: 1400, stock: 12 },
  { id: 4, nombre: "Panel LED Embutir 18W", categoria: "Paneles", precio: 12000, stock: 15 },
  { id: 5, nombre: "Panel LED Redondo 24W", categoria: "Paneles", precio: 16500, stock: 6 },
  { id: 6, nombre: "Plafón LED Superficie 12W", categoria: "Paneles", precio: 9800, stock: 14 },
  { id: 7, nombre: "Lámpara de Pie Nórdica", categoria: "Lámparas", precio: 34000, stock: 5 },
  { id: 8, nombre: "Lámpara Colgante Vintage", categoria: "Lámparas", precio: 22000, stock: 7 },
  { id: 9, nombre: "Lámpara de Mesa Minimalista", categoria: "Lámparas", precio: 18500, stock: 9 },
  { id: 10, nombre: "Perfil de Aluminio Difusor 1m", categoria: "Perfiles", precio: 800, stock: 25 },
  { id: 11, nombre: "Perfil de Aluminio Esquinero 2m", categoria: "Perfiles", precio: 1900, stock: 18 },
  { id: 12, nombre: "Perfil de Empotrar con Difusor", categoria: "Perfiles", precio: 2400, stock: 11 }
];

// Estado del carrito: leemos de Storage o arrancamos vacío
let carritoLumen = JSON.parse(localStorage.getItem("carritoLumen")) || [];

// 2. Selección de nodos del DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const totalCarritoTexto = document.getElementById("total-carrito");
const btnVaciar = document.getElementById("btn-vaciar");
const btnFinalizar = document.getElementById("btn-finalizar");
const inputBusqueda = document.getElementById("input-busqueda");
const filtroCategoria = document.getElementById("filtro-categoria");
const mensajeFeedback = document.getElementById("mensaje-feedback");
const mensajePromo = document.getElementById("mensaje-promo");

// 3. Manejo de Storage con try-catch-finally
function guardarCarritoEnStorage() {
  try {
    localStorage.setItem("carritoLumen", JSON.stringify(carritoLumen));
  } catch (error) {
    if (mensajeFeedback) {
      mensajeFeedback.textContent = "Ocurrió un error al guardar tu carrito.";
    }
  } finally {
    console.log("Sincronización del carrito finalizada.");
  }
}

// 4. Renderizado del catálogo en el DOM (sin dataset ni data-id)
function renderizarProductos(lista) {
  contenedorProductos.innerHTML = "";

  if (lista.length === 0) {
    contenedorProductos.innerHTML = "<p>No se encontraron productos coincidentes.</p>";
    return;
  }

  lista.forEach(function (producto) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-producto";

    tarjeta.innerHTML =
      "<h3>" + producto.nombre + "</h3>" +
      "<p><strong>Categoría:</strong> " + producto.categoria + "</p>" +
      "<p><strong>Precio:</strong> $" + producto.precio + "</p>" +
      "<p><strong>Stock disponible:</strong> " + producto.stock + " unidades</p>";

    // Botón agregar al carrito vinculado directamente al producto
    const botonAgregar = document.createElement("button");
    botonAgregar.className = "btn-primario";
    botonAgregar.textContent = "Agregar al carrito";
    botonAgregar.addEventListener("click", function () {
      agregarAlCarrito(producto);
    });

    tarjeta.appendChild(botonAgregar);
    contenedorProductos.appendChild(tarjeta);
  });
}

// 5. Agregar producto al carrito respetando el stock disponible
function agregarAlCarrito(producto) {
  const itemExistente = carritoLumen.find(function (item) {
    return item.id === producto.id;
  });

  if (itemExistente) {
    if (itemExistente.cantidad < producto.stock) {
      itemExistente.cantidad = itemExistente.cantidad + 1;
      mensajeFeedback.textContent = "Sumaste otra unidad de " + producto.nombre + ".";
    } else {
      mensajeFeedback.textContent = "Alcanzaste el stock máximo disponible de este producto.";
      return;
    }
  } else {
    carritoLumen.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
    mensajeFeedback.textContent = producto.nombre + " fue agregado a tu carrito.";
  }

  guardarCarritoEnStorage();
  renderizarCarrito();
}

// 6. Quitar una unidad o eliminar ítem del carrito (sin dataset)
function quitarDelCarrito(idProducto) {
  const item = carritoLumen.find(function (producto) {
    return producto.id === idProducto;
  });

  if (item) {
    if (item.cantidad > 1) {
      item.cantidad = item.cantidad - 1;
    } else {
      carritoLumen = carritoLumen.filter(function (producto) {
        return producto.id !== idProducto;
      });
    }
  }

  guardarCarritoEnStorage();
  renderizarCarrito();
}

// 7. Renderizar el carrito en pantalla y calcular el total acumulado
function renderizarCarrito() {
  if (!contenedorCarrito) return;
  contenedorCarrito.innerHTML = "";

  if (carritoLumen.length === 0) {
    contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    if (totalCarritoTexto) {
      totalCarritoTexto.textContent = "0";
    }
    return;
  }

  let totalAcumulado = 0;

  carritoLumen.forEach(function (item) {
    const subtotal = item.precio * item.cantidad;
    totalAcumulado = totalAcumulado + subtotal;

    const filaCarrito = document.createElement("div");
    filaCarrito.className = "item-carrito";

    filaCarrito.innerHTML =
      "<p><strong>" + item.nombre + "</strong> - Cantidad: " + item.cantidad + " - Subtotal: $" + subtotal + "</p>";

    // Botón para restar/quitar vinculado directamente al id
    const botonQuitar = document.createElement("button");
    botonQuitar.className = "btn-secundario";
    botonQuitar.textContent = "Quitar";
    botonQuitar.addEventListener("click", function () {
      quitarDelCarrito(item.id);
    });

    filaCarrito.appendChild(botonQuitar);
    contenedorCarrito.appendChild(filaCarrito);
  });

  if (totalCarritoTexto) {
    totalCarritoTexto.textContent = totalAcumulado;
  }
}

// 8. Vaciar carrito completo
function vaciarCarrito() {
  carritoLumen = [];
  guardarCarritoEnStorage();
  renderizarCarrito();
  if (mensajeFeedback) {
    mensajeFeedback.textContent = "Se vació el carrito.";
  }
}

// 9. Finalizar compra (Checkout)
function finalizarCompra() {
  if (carritoLumen.length === 0) {
    if (mensajeFeedback) {
      mensajeFeedback.textContent = "Tu carrito está vacío. Agregá productos antes de comprar.";
    }
    return;
  }

  carritoLumen = [];
  guardarCarritoEnStorage();
  renderizarCarrito();
  if (mensajeFeedback) {
    mensajeFeedback.textContent = "¡Gracias por tu compra en LUMEN! Tu pedido fue registrado.";
  }
}

// 10. Filtrar catálogo por texto y categoría combinados
function aplicarFiltros() {
  const termino = inputBusqueda.value.toLowerCase().trim();
  const categoriaSeleccionada = filtroCategoria ? filtroCategoria.value : "todas";

  const filtrados = productosIniciales.filter(function (producto) {
    const coincideNombre = producto.nombre.toLowerCase().includes(termino);
    const coincideCategoria = categoriaSeleccionada === "todas" || producto.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCategoria;
  });

  renderizarProductos(filtrados);
}

// 11. Eventos del DOM
if (btnVaciar) {
  btnVaciar.addEventListener("click", vaciarCarrito);
}

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", finalizarCompra);
}

inputBusqueda.addEventListener("input", aplicarFiltros);

if (filtroCategoria) {
  filtroCategoria.addEventListener("change", aplicarFiltros);
}

// 12. Carga inicial en pantalla
renderizarProductos(productosIniciales);
renderizarCarrito();

// 13. Temporizador (setTimeout): aviso contextual de descuento e-commerce
setTimeout(function () {
  if (mensajePromo) {
    mensajePromo.textContent = "¡Promo relámpago! Usá el cupón LUMEN10 para 10% OFF en tiras y perfiles.";
  }
}, 3000);
