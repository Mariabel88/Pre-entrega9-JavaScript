// 1. Array inicial de objetos literales (LUMEN)
const productosIniciales =[
    {id: 1, nombre: "Tira LED Cálida 2700K", precio: 1500, stock: 10},
    {id: 2, nombre: "Tira LED RGB Neón", precio: 2500, stock: 8},
    {id: 3, nombre: "Panel LED Embutir 18W", precio: 12000, stock: 15},
    {id: 4, nombre: "Lámpara de Pie Nórdica", precio: 3400, stock: 9},
    {id: 5, nombre: "Perfil de Aluminio Difusor", precio: 800, stock: 20}
];

// Leemos de localStorage; si no hay datos previos, cargamos los productos iniciales
let catalogoLumen = JSON.parse(localStorage.getItem("catalogoLumen")) || productosIniciales;

// 2. Selección de nodos del DOM (como vimos en clase)
const contenedorProductos = document.getElementById("contenedor-productos");
const formularioProducto = document.getElementById("formulario-producto");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputStock = document.getElementById("input-stock");
const inputBusqueda = document.getElementById("input-busqueda");
const mensajeFeedback = document.getElementById("mensaje-feedback");


// 3. Función auxiliar para guardar en localStorage
function guardarEnStorage(){
  try{
      localStorage.setItem("catalogoLumen", JSON.stringify(catalogoLumen));
  }catch(error){
    mensajeFeedback.textContent ="Ocurrió un error al guardar los datos";
  }finally{
    console.log("Proceso de guardado finalizado.");
  }
  
}


// 4.Renderizado del catálogo en el DOM
function renderizarProductos(lista) {
  contenedorProductos.innerHTML = "";

  if (lista.length === 0) {
    contenedorProductos.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  lista.forEach(producto => {
    //Desestructuración de propiedades
    const{id,nombre,precio,stock} = producto;


    contenedorProductos.innerHTML += `
    <div class= "tarjeta-producto">
      <h3>${nombre}</h3>
      <p><strong>Precio:</strong> $${precio}</p>
      <p><strong>Stock:</strong> ${stock} unidades</p>
      <button class="btn-eliminar" data-id="${id}">Eliminar</button>
    </div>
    `;
  
  });

  // Asignamos el evento click a los botones generados
  asignarEventosEliminar();
}

// 5. Función para escuchar el click en cada botón "Eliminar"
function asignarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");

  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", (evento) => {
      const idSeleccionado = parseInt(evento.target.getAttribute("data-id"), 10);
      eliminarProducto(idSeleccionado);
    });
  });
}


// 6. Función para eliminar del array, sincronizar con Storage y refrescar la vista
function eliminarProducto(id) {
  catalogoLumen = catalogoLumen.filter(producto => producto.id !== id);
  guardarEnStorage();
  mensajeFeedback.textContent = "Producto eliminado correctamente.";
  renderizarProductos(catalogoLumen);
}


// 7. Evento SUBMIT del formulario para agregar un producto
formularioProducto.addEventListener("submit", evento => {
  evento.preventDefault();

  const nombreValor = inputNombre.value.trim();
  const precioValor = parseFloat(inputPrecio.value);
  const stockValor = parseInt(inputStock.value, 10);

  const esFormularioValido = nombreValor !== "" && !isNaN(precioValor) && !isNaN(stockValor);

  // Operador ternario para el mensaje de feedback
  mensajeFeedback.textContent = esFormularioValido
    ? "¡Producto agregado con éxito!"
    : "Por favor, completa todos los campos.";

  if (esFormularioValido) {
    const nuevoProducto = {
      id: Date.now(),
      nombre: nombreValor,
      precio: precioValor,
      stock: stockValor
    };

    catalogoLumen.push(nuevoProducto);
    guardarEnStorage();
    formularioProducto.reset();
    inputBusqueda.value = "";
    renderizarProductos(catalogoLumen);
  }
});



// 8. Evento de teclado (INPUT) en el buscador para filtar en vivo
inputBusqueda.addEventListener("input", () => {
  const termino = inputBusqueda.value.toLowerCase().trim();
  
  const filtrados = catalogoLumen.filter(producto =>
    producto.nombre.toLowerCase().includes(termino)
  );
  renderizarProductos(filtrados);
});


// 9. Carga inicial
renderizarProductos(catalogoLumen);

//10.Temporizador: muestra una promoción a los 3 segundos de entrar
setTimeout(() => {
  const mensajePromo = document.getElementById("mensaje-promo");
  if(mensajePromo){
    mensajePromo.textContent = "¡Aprovechá 15% de descuento con el cupón LUMEN15!";
  }

},3000)